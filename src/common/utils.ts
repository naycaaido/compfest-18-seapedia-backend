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
      const sub = value['user']?.sub ?? -1
      const email = value['user']?.email ?? null
      const role =  value['user']?.role ?? null
      const userRoleId =  value['user']?.userRoleId ?? null
      return new Payload(sub,email,userRoleId,role)
    }
}

export const PublicUserRoles = [
  UserRole.DRIVER,
  UserRole.BUYER,
  UserRole.SELLER,
] as const;

export const enum DirType {
   STORE = 'store',
   PRODUCT = 'products'
}

export const addTimeToDate = (date:Date) => {
  date.setHours(23,59,59,999)
  return date
};