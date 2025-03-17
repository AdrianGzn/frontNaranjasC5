import { LoginRequest } from "../domain/LoginRequest";
import { ApiUserRepository } from "../infrastructure/apiUser.repository";
import { LoginResponse } from "../domain/LoginResponse";

export class LoginUserUseCase {
    private userRepository: ApiUserRepository;

    constructor(userRepository: ApiUserRepository) {
        this.userRepository = userRepository;
    }

    async login(loginRequest: LoginRequest): Promise<LoginResponse> {
        return this.userRepository.Login(loginRequest);
    }
}
