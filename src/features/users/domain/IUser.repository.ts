import { LoginRequest } from "./LoginRequest"
import { User } from "./user.entity"

export interface IUserRepository {
    Create(user : User): Promise<User>
    Login(loginrequest : LoginRequest): Promise<User>
}