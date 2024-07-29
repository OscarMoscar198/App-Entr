import ApiService from "../../infrastructure/services/ApiService";
import User from "../entities/User";

class UserRepository {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async login(email: string, password: string) {
    console.log("UserRepository: login called with", { email, password });
    try {
      const response = await this.apiService.post("/login", { email, password });
      console.log("UserRepository: login response", response);
      return response;
    } catch (error) {
      console.error("UserRepository: login error", error);
      throw error;
    }
  }

  async register(user: User) {
    console.log("UserRepository: register called with", user);
    try {
      const response = await this.apiService.post("/register", user);
      console.log("UserRepository: register response", response);
      return response;
    } catch (error) {
      console.error("UserRepository: register error", error);
      throw error;
    }
  }
}

export default UserRepository;
