// application/use-cases/UserService.ts
import UserRepository from "../../domain/repositories/UserRepository";
import User from "../../domain/entities/User";

class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async fetchUsers(): Promise<User[]> {
    return this.userRepository.getUsers();
  }
}

export default UserService;
