import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { FindOneOptions, FindOptionsRelations, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from './entities/user_role.entity';
import { UserRole } from './entities/role_user.enum';
import { BuyerService } from '../buyer/buyer.service';
import { SellerService } from '../seller/seller.service';
import { DriverService } from '../driver/driver.service';
import { AdminService } from '../admin/admin.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Payload } from 'src/common/utils';
import { log } from 'console';
import { instanceToPlain } from 'class-transformer';
import { Wallet } from '../wallet/wallet/entities/wallet.entity';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(UserRoles)
    private userRolesRepository: Repository<UserRoles>,

    private readonly supabaseService:SupabaseService,
    private readonly buyerService : BuyerService,
    private readonly sellerService : SellerService,
    private readonly driverService : DriverService,
    private readonly adminService : AdminService,
    
    private jwtService : JwtService
  ) {
    
  }

  async testConnection() {
    const { data, error } = await this.supabaseService.client.storage
        .from(process.env.SUPABASE_BUCKET!)
        .list();

    console.log(data);

    if (error) {
        console.error(error);
    }
}

  async login(loginUserDto : LoginUserDto){
    try {

      const relations: FindOptionsRelations<User> = {
          ...(loginUserDto.role === UserRole.ADMIN && { admin: true }),
          ...(loginUserDto.role === UserRole.BUYER && { buyer: true }),
          ...(loginUserDto.role === UserRole.SELLER && { seller: true }),
          ...(loginUserDto.role === UserRole.DRIVER && { driver: true }),
      }

      const user = await this.existAccount(loginUserDto.email,relations)
      if(!user){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"User"))
      }
      const isMatch = await bcrypt.compare(loginUserDto.password,user.password)
      if(!isMatch){
        throw new UnauthorizedException(exceptionMessage(ExceptionType.VALIDATION,"Invalid credentials"))
      }
      const idRole = this.getIdRole(user,loginUserDto.role)
      if(idRole == 0){
        throw new BadRequestException(exceptionMessage(ExceptionType.EMPTY,"User does not have the role"))
      }
      const payload = new Payload(
        user.id,
        user.email,
        idRole,
        loginUserDto.role)
        const accessToken = await this.jwtService.signAsync(payload.toObject())
        return accessToken
    }catch (error){
      throw error
    }
  }

  async saveRoles(email:string,role:UserRole){
    const user = await this.existAccount(email,{roles:true})
    if (!user){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"User"))
    }
    this.addRoles(role,user)
    await this.userRepository.save(user)
    return
  }

  async create(createUserDto: CreateUserDto) : Promise<User> {
    const hash_password = await this.hashing(createUserDto.password)
    const newUser = this.userRepository.create({
      ...createUserDto,
      password:hash_password,
      wallet:new Wallet()
    })
    this.addRoles(createUserDto.role,newUser)
    
    await this.userRepository.save(newUser)
    return newUser
  }

  findAll() {
    return this.userRepository.find({
      relations:[
        "buyer"
      ]
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where:{
        id
      },
      relations:[
        "roles"
      ]
    })
    return user;
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findOne({
      where:{
        id
      },
      relations:[
        "roles",
        "buyer",
      ]
    })
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async changeRoleCurrent(payload:Payload, changeUserRoleDto : ChangeUserRoleDto){
    const relations: FindOptionsRelations<User> = {
          ...(changeUserRoleDto.role === UserRole.ADMIN && { admin: true }),
          ...(changeUserRoleDto.role === UserRole.BUYER && { buyer: true }),
          ...(changeUserRoleDto.role === UserRole.SELLER && { seller: true }),
          ...(changeUserRoleDto.role === UserRole.DRIVER && { driver: true }),
      }
    if(payload.role == changeUserRoleDto.role){
      throw new BadRequestException(exceptionMessage(ExceptionType.BAD_REQUEST,"Cannot be the same role as current active"))
    }
    const user = await this.userRepository.findOne({
      where:{
        id:payload.sub
      },
      relations:relations
    })
    if(!user){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"User"))
    }
    const idRole = this.getIdRole(user,changeUserRoleDto.role)
    if(idRole == 0){
      throw new BadRequestException(exceptionMessage(ExceptionType.EMPTY,"User does not have the role"))
    }

    const newPayload = new Payload(
      payload.sub,
      payload.email,
      idRole,
      changeUserRoleDto.role)
    const accessToken = await this.jwtService.signAsync(newPayload.toObject())
    return accessToken
  }
  async remove(id: number,payload:Payload) {
    const where: any = { id };
    if (payload.role != UserRole.ADMIN) {
      where.id = payload.sub;
    }
    const result = await this.userRepository.delete(where)
    if(result.affected! <= 0){
      throw new NotFoundException(exceptionMessage(ExceptionType.DEFAULT,"Delete the data"))
    }
    return true;
  }

  private async hashing(password:string):Promise<string>{
    const salt = Number(process.env.SALT)
    const hash = await bcrypt.hash(password,salt);
    return hash
  }

  private async existAccount(email:string,relations?:FindOptionsRelations<User>){
    try {
       const user: User|null = await this.userRepository.findOne({
          where:{email},
          relations: relations
        })
    return user
    } catch (error) {
      throw error
    }
  
  }

  private getIdRole(user: User, role:UserRole): number {
    const roleMap: Record<UserRole, number | undefined> = {
      [UserRole.BUYER]: user.buyer?.id,
      [UserRole.SELLER]: user.seller?.id,
      [UserRole.ADMIN]: user.admin?.id,
      [UserRole.DRIVER]: user.driver?.id,
    };

    return roleMap[role] ?? 0;
  }

  private validateUserRole(user:User, newRole:UserRole){
    const userRoles =  user?.roles?.map(r => r.role);

    if(!userRoles){
      return
    }

    if (userRoles.includes(UserRole.ADMIN)){
      throw new BadRequestException(exceptionMessage(ExceptionType.EMPTY,"This user cannot have multiple roles since its already ADMIN"))
    }
    if(userRoles.length > 0 && newRole == UserRole.ADMIN){
      throw new BadRequestException(exceptionMessage(ExceptionType.EMPTY,"This user cannot have roles ADMIN since its already have role"))
    }
  }

  private addRoles(role:UserRole,user:User){
    this.validateUserRole(user,role)
    log("Role : ",user.roles)
    user.roles ??= [];

    switch (role) {
      case UserRole.BUYER:
        user.buyer = this.buyerService.createForUser(user.id)
        break;

      case UserRole.SELLER:
        user.seller = this.sellerService.createForUser(user.id)
        break;

      case UserRole.DRIVER:
        user.driver = this.driverService.createForUser(user.id)
        break;

      case UserRole.ADMIN:
        user.admin = this.adminService.createForUser(user.id)
        break;
      }

       user.roles.push(
        this.userRolesRepository.create({
        role,
      }),
    );
  }
}
