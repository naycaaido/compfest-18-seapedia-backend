import { UserRole } from "src/features/user/entities/role_user.enum";

export class Payload{
    sub!:number
    email!:string
    userRoleId!:number
    role!:UserRole

    constructor(sub:number,email:string,userRoleId:number,role:UserRole) {
        this.sub =sub;
        this.userRoleId = userRoleId
        this.email =email;
        this.role =role
    }  

    toObject() {
      return {
        sub: this.sub,
        email: this.email,
        userRoleId: this.userRoleId,
        role: this.role,
      };
    }

    static toEntity(value:object): Payload{
      const sub = value['user'].sub
      const email = value['user'].email
      const role =  value['user'].role
      const userRoleId =  value['user'].user_role_id
      return new Payload(sub,email,userRoleId,role)
    }
}

export const PublicUserRoles = [
  UserRole.DRIVER,
  UserRole.BUYER,
  UserRole.SELLER,
] as const;
