import Teacher from '../../teacher/repositories/models/Teacher';
import Role from './models/Role';
import User from './models/User';

class userRepository {
  async createUser(user: Partial<User>) {
    return await User.create(user);
  }

  async getUserByTeacherId(teacher_id: number) {
    return await User.findOne({
      where: {
        teacher_id,
      },
    });
  }

  async getUserById(id: number) {
    return await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'role',
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
          model: Role,
          as: 'role',
          foreignKey: 'role_id',
        },
        {
          model: Teacher,
          as: 'teacher',
          foreignKey: 'teacher_id',
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

  async getUserByEmployeeNumber(employee_number: number) {
    return await User.findOne({
      where: {
        teacher_employee_number: employee_number,
      },
    });
  }
}

export default new userRepository();
