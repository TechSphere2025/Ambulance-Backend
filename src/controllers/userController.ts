import { NextFunction, Request, Response } from "express";
import baseRepository from "../repo/baseRepo";
import { userSchema } from "../model/user";
import { loginSchema } from "../model/login";
import common from "../common/common";
import { joiSchema } from '../common/joiValidations/validator';
import ResponseMessages from "../common/responseMessages";
import { responseMessage } from "../utils/serverResponses";
import logger from "../logger/logger";


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  logger.info("Entered Into Create User")
  try {

    const { error } = joiSchema.userSchema.validate(req.body)

    if (error) {
      next(error)
      return
    }
    const { name, email, password } = req.body;
    const newUser: any = await baseRepository.insert(
      "users",
      { name, email },
      userSchema
    );
    let hashedPassword = await common.hashPassword(password);
    await baseRepository.insert(
      "login",
      { user_id: newUser.id, password: hashedPassword },
      loginSchema
    );

    res.status(201).json(newUser);
  } catch (err) {
    console.log(err)
    return ResponseMessages.ErrorHandlerMethod(res, responseMessage.internal_server_error, err)

    // res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await baseRepository.findAll("users");
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("asdfghjk", req.body)
    const user: any = await baseRepository.findOne("users", "email = $1", [
      email,
    ]);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const loginData: any = await baseRepository.findOne(
      "login",
      "user_id = $1",
      [user.id]
    );
    let matachPassword = await common.comparePassword(
      password,
      loginData.password
    );
    if (!loginData || !matachPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    let token = await common.generatetoken(user.id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


