import { NextFunction, Response } from 'express';
import { getRoleById } from '../modules/userManagement';

export async function isTeacherOwnDataMiddleware(
  req: any,
  res: Response,
  next: NextFunction
) {
  const role = await getRoleById(req.user.role_id);

  if (!role) {
    return res
      .status(403)
      .json({ message: 'Acceso denegado, rol no encontrado' });
  }

  if (role.name == 'teacher') {
    const teacherId = req.user.teacher_id;
    const routeId = req.params.id;

    if (teacherId != routeId) {
      return res
        .status(403)
        .json({ message: 'Acceso denegado, solo puedes acceder a tus datos' });
    }
  }
  next();
}
