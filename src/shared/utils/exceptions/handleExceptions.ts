import * as yup from 'yup';
import { Response } from 'express';
import { DataBaseError, ResourceNotFound } from './customExceptions';

export async function returnError(res: Response, error: Error) {
    // Verifica si las cabeceras ya fueron enviadas
    if (res.headersSent) {
        console.error('Las cabeceras ya han sido enviadas. No se puede enviar otra respuesta.', error);
        return;
    }

    // Manejo de errores específicos
    if (error instanceof yup.ValidationError || error instanceof DataBaseError) {
        console.log("ValidationError or DataBaseError: ", error.message);
        res.status(400).json({ "error": error.message });
    } else if (error instanceof ResourceNotFound) {
        console.log("ResourceNotFound: ", error.message);
        res.status(404).json({ "error": error.message });
    } else {
        console.error("Unhandled error: ", error.message);
        res.status(500).json({ "error": error.message });
    }
};
