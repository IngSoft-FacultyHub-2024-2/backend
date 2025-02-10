import { NextFunction, Response } from 'express';
import { getRoleById } from '../modules/userManagement';

export async function isCoordinatorMiddleware(
  req: any,
  res: Response,
  next: NextFunction
) {
  const role = await getRoleById(req.user.role);

  if (!role) {
    return res
      .status(403)
      .json({ message: 'Acceso denegado, rol no encontrado' });
  }

  if (role.name !== 'coordinator') {
    return res
      .status(403)
      .json({ message: 'Acceso denegado, solo coordinadores' });
  }
  next();
}
