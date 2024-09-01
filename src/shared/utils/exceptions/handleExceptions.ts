import * as yup from 'yup';
import { Response } from 'express';
import { DataBaseError, ResourceNotFound } from './customExceptions';

export async function returnError(res: Response, error: Error){
    if (error instanceof yup.ValidationError || error instanceof DataBaseError){
        console.log(error)
        console.log("ValidationError: ", error.message);
        res.status(400).json({"error": error.message});
    } else if (error instanceof ResourceNotFound) {
        console.log("ResourceNotFound: ", error.message);
        res.status(404).json({"error": error.message});
    }else{
        res.status(500).json({"error": error.message});
    }
};