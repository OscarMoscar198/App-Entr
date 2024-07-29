import User from '../../domain/entities/User';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}

export interface IUserRepository {
  save(user: User): Promise<any>;
  findByEmail(email: string): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
  private users: User[] = [];

  async save(user: User): Promise<any> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }
}
