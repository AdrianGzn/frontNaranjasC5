import { ApiUserRepository } from "../infrastructure/apiUser.repository";

export class DeleteUserUseCase {
    private userRepository: ApiUserRepository;

    constructor(userRepository: ApiUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(id: number): Promise<boolean> {
        return await this.userRepository.Delete(id);
    }
}