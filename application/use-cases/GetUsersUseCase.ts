import UserRepository from "../../domain/repositories/UserRepository";
import User from "../../domain/entities/User";

class GetUsersUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(): Promise<User[]> {
    return this.userRepository.getUsers();
  }
}

export default GetUsersUseCase;
