import { LoginRequest } from "./LoginRequest"
import { LoginResponse } from "./LoginResponse"
import { User } from "./user.entity"

export interface IUserRepository {
    Create(user : User): Promise<User>
    Login(loginrequest : LoginRequest): Promise<LoginResponse>
    Update(user : User): Promise<User>
    Delete(id : string): Promise<boolean>
}