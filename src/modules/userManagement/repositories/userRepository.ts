import Teacher from '../../teacher/repositories/models/Teacher';
import User from './models/User';

class userRepository {
  async createUser(user: Partial<User>) {
    return await User.create(user);
  }

  async getUserByTeacherId(teacherId: number) {
    return await User.findOne({
      where: {
        teacherId,
      },
    });
  }

  async getUserById(id: number) {
    return await User.findByPk(id, {
      include: [
        {
          association: User.associations.role,
          attributes: ['name'],
        },
        {
          model: Teacher,
          as: 'teacher',
        },
      ],
    });
  }

  async getUsers() {
    return await User.findAll({
      include: [
        {
          association: User.associations.role,
          attributes: ['name'],
        },
        {
          model: Teacher,
          as: 'teacher',
        },
      ],
    });
  }

  async updatePassword(id: number, password: string) {
    return await User.update(
      {
        password,
      },
      {
        where: {
          id,
        },
      }
    );
  }
}

export default new userRepository();
