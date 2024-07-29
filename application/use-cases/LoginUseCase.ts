import UserRepository from "../../domain/repositories/UserRepository";

class LoginUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(email: string, password: string) {
    console.log("LoginUseCase: execute called with", { email, password });
    return this.userRepository.login(email, password);
  }
}

export default LoginUseCase;
