import UserRepository from "../../domain/repositories/UserRepository";
import User from "../../domain/entities/User";

class RegisterUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(user: User) {
    return this.userRepository.register(user);
  }
}

export default RegisterUseCase;
