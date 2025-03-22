import { NextFunction, Request, Response } from "express";
import baseRepository from "../repo/baseRepo";
import { hospitalSchema } from "../model/hospital";
import { userSchema } from "../model/user";
import { loginSchema } from "../model/login";
import { userRolesSchema } from "../model/userRoles";





import { joiSchema } from '../common/joiValidations/validator';
import ResponseMessages from "../common/responseMessages";
import { responseMessage } from "../utils/serverResponses";
import logger from "../logger/logger";
import { statuses, statusmap, getStatus } from "../utils/constants";
import common from "../common/common";
import { getdetailsfromtoken } from '../common/tokenvalidator';




export const createHospital = async (req: Request, res: Response, next: NextFunction) => {
  logger.info("Entered Into Create hospital");

  try {

    const { error } = joiSchema.hospitalSchema.validate(req.body);

    if (error) {
      next(error);
      return;
    }
    const { name, countrycode, mobileno, email, poc } = req.body;

    let status = getStatus("active")

    const newHospital: any = await baseRepository.insert(
      "hospital",
      { name, countrycode, mobileno, email, status, },
      hospitalSchema
    );

    const pocData = {
      firstname: poc.firstname,
      lastname: poc.lastname,
      email: poc.email,
      countrycode: poc.countrycode,
      mobileno: poc.mobileno,
      hospitalid: newHospital.id,
      status: status
    };

    let newUser: any = await baseRepository.insert("users", pocData, userSchema);


    let password = await common.generateRandomPassword();


    let hashedPassword = await common.hashPassword(password);

    // Check if the provided role exists in the 'role' table
    const roleData: any = await baseRepository.select(
      "role",
      { name: "admin" }, // Assuming the role is passed as a string (e.g., 'admin')
      ['id']
    );

    if (!roleData || roleData.length === 0) {
      return res.status(400).json({ error: "Role not found" });
    }

    const roleId = roleData[0].id;  // Get the corresponding role_id


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



    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const createHospitalUser = async (req: Request, res: Response, next: NextFunction) => {
  logger.info("Entered Into hospital User");

  try {
    // Validate request body


    const { error } = joiSchema.userSchema.validate(req.body);

    const token = req.headers['token'];

    let details = await getdetailsfromtoken(token)

    if (error) {
      next(error);
      return;
    }


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

    let status = getStatus("active")
    let hospitalid = details.hospitalid;
    // Insert user data into the 'users' table
    const newUser: any = await baseRepository.insert(
      "users",
      { firstname, lastname, email, countrycode, mobileno, status, hospitalid },
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

export const hospitalusers = async (req: Request, res: Response, next: NextFunction) => {
  try {

    let hospitalId = 1
    const users = await baseRepository.findAll("users", {
      hospitalId: hospitalId
    });

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
