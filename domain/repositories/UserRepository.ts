import ApiService from "../../infrastructure/services/ApiService";
import User from "../entities/User";

class UserRepository {
  getUsers(): User[] | PromiseLike<User[]> {
    throw new Error("Method not implemented.");
  }
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async login(email: string, password: string) {
    return this.apiService.post("/login", { email, password });
  }

  async register(user: User) {
    return this.apiService.post("/register", user);
  }
}

export default UserRepository;
