import { Request, Response } from "express";
import baseRepository from "../repo/baseRepo";
import { addressSchema } from "../model/address";

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const {
      hospitalId,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      lat,
      long,
      status,
    } = req.body;
    console.log("123456789", req.body);
    const addresses = await baseRepository.insert(
      "address",
      {
        hospitalId,
        addressLine1,
        addressLine2,
        landmark,
        city,
        state,
        lat,
        long,
        status,
      },
      addressSchema
    );
    res.json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching addresses" });
  }
};
