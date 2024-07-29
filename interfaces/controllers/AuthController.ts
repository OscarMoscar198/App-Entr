// interfaces/controllers/AuthController.ts
import ApiService from "../../infrastructure/services/ApiService";
import AuthService from "../../domain/services/AuthService";
import LoginUseCase from "../../application/use-cases/LoginUseCase";
import RegisterUseCase from "../../application/use-cases/RegisterUseCase";
import User from "../../domain/entities/User";

class AuthController {
  private loginUseCase: LoginUseCase;
  private registerUseCase: RegisterUseCase;

  constructor(apiUrl: string) {
    const apiService = new ApiService(apiUrl);
    const authService = new AuthService(apiService);
    this.loginUseCase = new LoginUseCase(authService);
    this.registerUseCase = new RegisterUseCase(authService);
  }

  async login(email: string, password: string) {
    console.log("AuthController: login called");
    return this.loginUseCase.execute(email, password);
  }

  async register(user: User) {
    console.log("AuthController: register called");
    return this.registerUseCase.execute(user);
  }
}

export default AuthController;
