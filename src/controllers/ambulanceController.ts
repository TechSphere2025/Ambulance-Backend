import { NextFunction, Request, Response } from "express";
import baseRepository from "../repo/baseRepo";
import { Ambulance, ambulanceSchema } from "../model/ambulance";
import common from "../common/common";
import { joiSchema } from '../common/joiValidations/validator';
import ResponseMessages from "../common/responseMessages";
import { responseMessage } from "../utils/serverResponses";
import { statuses,statusmap,getStatus,ambulanceStatus,ambulanceStatusmap,getambulanceStatus } from "../utils/constants";

import logger from "../logger/logger";
import { getdetailsfromtoken } from "../common/tokenvalidator";


export const createAmbulance = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Entered Into create ambulance")
    try {

        const { error } = joiSchema.ambulanceSchema.validate(req.body)


        if (error) {
            next(error)
            return
        }
        const { vehicle_no,type,vehicle_type } = req.body;
        let status=getambulanceStatus(ambulanceStatus.available)

         const token = req.headers['token'];

        
        let details = await getdetailsfromtoken(token)
        let hospital_id = details.hospitalid;

        

      

        const newambulance: any = await baseRepository.insert(
            "ambulances",{vehicle_no,type,vehicle_type,hospital_id,status},
            ambulanceSchema
        );


        res.status(200).json(newambulance);
    } catch (err) {
        return ResponseMessages.ErrorHandlerMethod(res, responseMessage.internal_server_error, err)

    }
};

export const getambulances = async (req: Request, res: Response) => {
    try {

        const token = req.headers['token'];

        let details = await getdetailsfromtoken(token)
    
        
            const ambulances: any[] = await baseRepository.findAll("ambulances", {
                hospital_id: details.hospitalid,
        
            });

        if (ambulances && ambulances.length > 0) {
            const modifiedAmbulances = ambulances.map((ambulance: Ambulance) => ({
                ...ambulance,  
                status: getambulanceStatus(ambulance.status) 
            }));

            res.json(modifiedAmbulances);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};



