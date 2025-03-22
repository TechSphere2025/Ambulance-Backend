import { Request, Response } from "express";
import baseRepository from "../repo/baseRepo";
import { RequestSchema } from "../model/request";
import { patientSchema } from "../model/patient";
import { paymentSchema } from "../model/payment";

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { hospitalId, patientId, paymentId, status } =
      req.body;

    const patient = await baseRepository.findAll(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // const pickupDetails = await baseRepository.findAll(pickupId);
    // if (!pickupDetails) {
    //     return res.status(404).json({ message: "Pickup address not found" });
    // }

    // const dropDetails = await baseRepository.findAll(dropId);
    // if (!dropDetails) {
    //     return res.status(404).json({ message: "Drop address not found" });
    // }

    const payment = await baseRepository.findAll(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const request: any = await baseRepository.insert(
      "requests",
      {
        hospitalId,
        patientId,
        // pickupDetails,
        // dropDetails,
        paymentId,
        status,
      },
      RequestSchema
    );

    await baseRepository.insert(
      "payment",
      {
        paymentId: request.id,
      },
      paymentSchema
    );
    await baseRepository.insert(
      "patient",
      {
        patientId: request.id,
      },
      patientSchema
    );

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating request" });
  }
};
