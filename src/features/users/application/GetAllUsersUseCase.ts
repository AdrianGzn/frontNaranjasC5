import { ApiUserRepository } from "../infrastructure/apiUser.repository";

export class GetAllUsersUseCase {
    private userRepository: ApiUserRepository;

    constructor(userRepository: ApiUserRepository) {
        this.userRepository = userRepository;
    }

    async execute() {
        return await this.userRepository.GetAll();
    }
}