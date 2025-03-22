import { Request, Response, NextFunction } from 'express';
// import { MongoError } from 'mongodb';
// import { Error as MongooseError } from 'mongoose';
import logger from '../logger/logger';
import { serverResponseCodes } from '../utils/serverResponses';
//response message  class

export class ResponseMessages {
    async noDataFound(res: Response, message: string) {
        logger.info(message)
        return res.status(serverResponseCodes.NoData).json({
            type: true,
            message: message,
        })
    }
    async invalidParameters(res:Response, message: string){
        logger.info(message)
        return res.status(serverResponseCodes.Invalid_Parameters).json({
            type: true,
            message:message
        })
    }
    async invalidMessage(res: Response, message: string) {
        logger.info(message)
        return res.status(serverResponseCodes.Invalid_Parameters).json({
            type: true,
            message: message,
        })
    }
    userBlocked(res:Response,message: string){
        logger.info(message)
        return res.status(serverResponseCodes.Permissions_Denied).json({
            type: true,
            message:message
        })
    }
    unauthorized(res:Response,message: string){
        logger.info(message)
        return res.status(serverResponseCodes.Unauthorized).json({
            type: true,
            message:message
        })
    }

    async alreadyExist(res: Response, message: string) {
        logger.info(message)
        return res.status(serverResponseCodes.AlreadyExist).json({
            type: true,
            message: message,
        })
    }
    async invalidToken(res: Response, message: string) {
        logger.info(message)
        return res.status(serverResponseCodes.AcessToken).json({
            type: true,
            message: message,
        })
    }

    //Error handler
    async ErrorHandlerMethod(res: Response, message: any, err: any) {
        
        // Other MongoDB errors or unexpected errors
        logger.error('MongoDB error:', err);
        return res.status(500).json({ error: 'Internal Server Error', message: err });
    };
    //success response message
    async Response(res: Response, message: string, data?: Object) {
        logger.info(message)
        return res.status(serverResponseCodes.Success).json({
            type: true,
            message: message,
            data: data,

        })

    };

    async validation(res: Response, message: string) {
        logger.info(message)
        
        return res.status(400).json({
            type: true,
            message: message,

        })

    };



    async loginResponse(res: Response, code: number, message: string, data?: any, token?: any) {
        logger.info(message)
        return res.status(code).json({
            type: true,
            message: message,
            token: token,
            data: data

        })
    }


    async keyRequired(res: Response, message: string) {
        logger.info(message)
        return res.status(400).json({
            type: true,
            message: message,

        })

    }

}
export default new ResponseMessages();
