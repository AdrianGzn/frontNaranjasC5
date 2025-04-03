import { IUserRepository } from "../domain/IUser.repository";


export class GetAllUsersUseCase {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute() {
        return await this.userRepository.GetAll();
    }
}