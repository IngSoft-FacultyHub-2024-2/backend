import { Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import * as yup from 'yup';
import { DataBaseError, ResourceNotFound } from './customExceptions';

export async function returnError(res: Response, error: Error) {
  // Verifica si las cabeceras ya fueron enviadas
  if (res.headersSent) {
    console.error(
      'Las cabeceras ya han sido enviadas. No se puede enviar otra respuesta.',
      error
    );
    return;
  }

  // Manejo de errores específicos
  if (error instanceof yup.ValidationError || error instanceof DataBaseError) {
    console.log('ValidationError or DataBaseError: ', error.message);
    res.status(400).json({ error: error.message });
  } else if (error instanceof ResourceNotFound) {
    console.log('ResourceNotFound: ', error.message);
    res.status(404).json({ error: error.message });
  } else if (error instanceof UniqueConstraintError) {
    console.log('Unique violation: ', error.message);
    res.status(409).json({ error: error.message });
  } else {
    console.error('Unhandled error: ', error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function errorResolver(error: Error) {
  // Manejo de errores específicos
  if (error instanceof yup.ValidationError || error instanceof DataBaseError) {
    console.log('ValidationError or DataBaseError: ', error.message);
    return { status: 400, message: error.message };
  } else if (error instanceof ResourceNotFound) {
    console.log('ResourceNotFound: ', error.message);
    return { status: 404, message: error.message };
  } else if (error instanceof UniqueConstraintError) {
    console.log('Unique violation: ', error.message);
    return { status: 409, message: error.message };
  } else {
    console.error('Unhandled error: ', error.message);
    return { status: 500, message: error.message };
  }
}
