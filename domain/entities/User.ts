// domain/entities/User.ts
class User {
  id: number;
  name: string;
  email: string;
  password: string;
  height?: number;
  weight?: number;
  sex?: string;
  nickname?: string;

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    height?: number,
    weight?: number,
    sex?: string,
    nickname?: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.height = height;
    this.weight = weight;
    this.sex = sex;
    this.nickname = nickname;
  }
}

export default User;
