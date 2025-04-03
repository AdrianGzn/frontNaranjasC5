import { User } from "../domain/user.entity";
import { ApiUserRepository } from "../infrastructure/apiUser.repository";

export class GetByJefeUseCase {
  constructor(private userRepository: ApiUserRepository) { }

  async execute(jefeId: number): Promise<User[]> {
    return await this.userRepository.GetByJefe(jefeId);
  }
}