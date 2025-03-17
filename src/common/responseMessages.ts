import { Request, Response, NextFunction } from 'express';

import { serverResponseCodes } from '../utils/constants';
//response message  class

export class ResponseMessages {
    async noDataFound(res: Response, message: string) {
        //logger.info(message)
        return res.status(serverResponseCodes.NoData).json({
            type: true,
            message: message,
        })
    }
    async invalidParameters(res:Response, message: string){
        //logger.info(message)
        return res.status(serverResponseCodes.Invalid_Parameters).json({
            type: true,
            message:message
        })
    }
    async invalidMessage(res: Response, message: string) {
        //logger.info(message)
        return res.status(serverResponseCodes.Invalid_Parameters).json({
            type: true,
            message: message,
        })
    }
    userBlocked(res:Response,message: string){
        //logger.info(message)
        return res.status(serverResponseCodes.Permissions_Denied).json({
            type: true,
            message:message
        })
    }
    unauthorized(res:Response,message: string){
        //logger.info(message)
        return res.status(serverResponseCodes.Unauthorized).json({
            type: true,
            message:message
        })
    }
   
    async limitExceeded(res:Response,message:string){
        return res.status(serverResponseCodes.limitExceeded).json({
            type:true,
            message:message
        }) 
    }
      
    async alreadyExist(res: Response, message: string) {
        //logger.info(message)
        return res.status(serverResponseCodes.AlreadyExist).json({
            type: true,
            message: message,
        })
    }
    async invalidToken(res: Response, message: string) {
        //logger.info(message)
        return res.status(serverResponseCodes.AcessToken).json({
            type: false,
            message: message,
        })
    }

   
    async successResponse(res: Response, message: string, data?: Object) {
        //logger.info(message)
        return res.status(serverResponseCodes.Success).json({
            type: true,
            message: message,
            data: data,

        })

    };

    async validation(res: Response, message: string) {
        //logger.info(message)
        
        return res.status(serverResponseCodes.NoData).json({
            type: true,
            message: message,

        })

    };



    async loginResponse(res: Response, code: number, message: string, data?: any, token?: any) {
        //logger.info(message)
        return res.status(code).json({
            type: true,
            message: message,
            token: token,
            data: data

        })
    }


    async keyRequired(res: Response, message: string) {
        //logger.info(message)
        return res.status(400).json({
            type: true,
            message: message,

        })

    }

}
export default new ResponseMessages();