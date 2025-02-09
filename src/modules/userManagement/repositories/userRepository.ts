import { Op } from 'sequelize';
import sequelize from '../../../config/database';
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

  async getUsers(
    limit: number,
    offset: number,
    search?: string,
    role?: string,
    is_active?: string
  ) {
    const searchQuery = search
      ? {
          [Op.or]: [
            sequelize.where(
              sequelize.cast(
                sequelize.col('teacher_employee_number'),
                'varchar'
              ),
              { [Op.iLike]: `%${search}%` }
            ),
            sequelize.where(
              sequelize.cast(sequelize.col('teacher.name'), 'varchar'),
              { [Op.iLike]: `%${search}%` }
            ),
            sequelize.where(
              sequelize.cast(sequelize.col('teacher.surname'), 'varchar'),
              { [Op.iLike]: `%${search}%` }
            ),
          ],
        }
      : {};

    const roleQuery = role
      ? {
          role_id: role,
        }
      : {};

    const isActiveQuery = is_active
      ? {
          is_active,
        }
      : {};

    console.log(searchQuery);

    const users = await User.findAndCountAll({
      where: {
        ...searchQuery,
        ...roleQuery,
        ...isActiveQuery,
      },
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
          paranoid: false,
        },
      ],
      order: sequelize.literal('teacher.name ASC'),
      limit,
      offset,
      distinct: true,
    });

    return users;
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

  async unsubscribeUser(id: number) {
    return await User.update(
      {
        is_active: false,
      },
      {
        where: {
          id,
        },
      }
    );
  }

  async getRoles() {
    return await Role.findAll();
  }

  async updateUser(id: number, role_id: number, password?: string) {
    // console.log(user);
    // console.log(id);

    return await User.update(
      {
        role_id,
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
