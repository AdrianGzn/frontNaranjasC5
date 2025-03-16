import { User } from "../domain/user.entity";
import { ApiUserRepository } from "../infrastructure/apiUser.repository";

export class CreateUserUseCase {
  constructor(private userRepository: ApiUserRepository) {}

  async execute(user: User): Promise<void> {
    await this.userRepository.Create(user);
  }
}