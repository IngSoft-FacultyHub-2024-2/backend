import User from './models/User';

class userRepository {
  async createUser(user: Partial<User>) {
    return await User.create(user);
  }
}

export default new userRepository();
