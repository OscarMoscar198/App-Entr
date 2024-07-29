// domain/services/AuthService.ts
import UserRepository from "../../domain/repositories/UserRepository";
import User from "../../domain/entities/User";
import ApiService from "../../infrastructure/services/ApiService";

class AuthService implements UserRepository {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async login(email: string, password: string): Promise<any> {
    return this.apiService.post("/login", { email, password });
  }

  async register(user: User): Promise<any> {
    const userData = {
      id: user.id.toString(), // Convertir el id a string si es necesario
      name: user.name,
      email: user.email,
      password: user.password,
      height: user.height,
      weight: user.weight,
      sex: user.sex,
      nickname: user.nickname,
    };
    return this.apiService.post("/register", userData);
  }

  async getUsers(): Promise<User[]> {
    const response = await this.apiService.get("/list");
    return response.data.map((user: any) => new User(
      user.UserID,
      user.Nombre,
      user.Correo,
      '', // assuming password is not needed here
      parseFloat(user.Altura),
      parseFloat(user.Peso),
      user.Gender
    ));
  }
}

export default AuthService;
