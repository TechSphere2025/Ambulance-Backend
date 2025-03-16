import { Request, Response } from "express";
import baseRepository from "../repo/baseRepo";
import { hospitalSchema } from "../model/hospital";

export const createHospital = async (req: Request, res: Response) => {
  try {
    const { name, mobileNo, secondaryMobileNo, emailid, status , orgName, orgType} = req.body;
    console.log("asdfgh", req.body);
    const newUser: any = await baseRepository.insert(
      "hospital",
      { name, mobileNo, secondaryMobileNo, emailid, status, orgName, orgType },
      hospitalSchema
    );
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
