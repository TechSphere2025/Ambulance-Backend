import { NextFunction, Request, Response } from "express";
import baseRepository from "../repo/baseRepo";
import { userSchema } from "../model/user";
import { loginSchema } from "../model/login";
import { userRolesSchema } from "../model/userRoles";




import common from "../common/common";
import { joiSchema } from '../common/joiValidations/validator';
import ResponseMessages from "../common/responseMessages";
import { responseMessage } from "../utils/serverResponses";
import logger from "../logger/logger";
import { statuses,statusmap,getStatus } from "../utils/constants";



export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  logger.info("Entered Into Create User");

  try {
    // Validate request body
    const { error } = joiSchema.userSchema.validate(req.body);

    console.log("error",error)
    if (error) {
      next(error);
      return;
    }
    console.log("111")

    // Extract user information and role from the request body
    const { firstname, lastname, email, countrycode, mobileno, roles } = req.body;

    // Generate a random password
    let password = await common.generateRandomPassword();

    // Check if the provided role exists in the 'role' table
    const roleData: any = await baseRepository.select(
      "role",
      { name: roles[0] }, // Assuming the role is passed as a string (e.g., 'admin')
      ['id']
    );

    if (!roleData || roleData.length === 0) {
      return res.status(400).json({ error: "Role not found" });
    }

    const roleId = roleData[0].id;  // Get the corresponding role_id

    let status=getStatus("active")
    
    // Insert user data into the 'users' table
    const newUser: any = await baseRepository.insert(
      "users",
      { firstname, lastname, email, countrycode, mobileno,status },
      userSchema
    );

    // Hash the generated password
    let hashedPassword = await common.hashPassword(password);

    // Insert the user into the 'login' table
    await baseRepository.insert(
      "login",
      { user_id: newUser.id, password: hashedPassword },
      loginSchema
    );

    // Insert the user's role into the 'user_roles' table
    const userRolesData = [
      {
        user_id: newUser.id,
        role_id: roleId
      }
    ];

    // Insert the role into the 'user_roles' table
    await baseRepository.insertMultiple("user_roles", userRolesData, userRolesSchema);

    // Respond with the created user
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    return ResponseMessages.ErrorHandlerMethod(res, responseMessage.internal_server_error, err);
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


