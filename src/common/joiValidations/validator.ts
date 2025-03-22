
import Joi from 'joi';

//import {JoiExtensionFile} from 'joi-extension-file';
import { commonValidations } from '../../utils/constantValidations';
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/;
//const JoiExtended = Joi.extend(JoiExtensionFile);
//joi for validation
enum RoleName {
    MASTERADMIN = "MASTERADMIN",
    SUPERADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",
    STAFF = "STAFF",
    DRIVER = "DRIVER",
    POLICE = "POLICE",
}

const userSchema = Joi.object({
    countrycode: Joi.string().required().messages({
        'string.empty': commonValidations.countrycode.empty,
        'any.required': commonValidations.countrycode.required,
        'string.pattern.base': 'Invalid CountryCode'
    }),
    mobileno: Joi.string().required().regex(/^[6-9]\d{9}$/).messages({
        'number.empty': commonValidations.mobileNumber.empty,
        'any.required': commonValidations.mobileNumber.required,
        'string.pattern.base': 'Invalid MobileNumber'
    }),
    firstname: Joi.string().required().messages({
        'string.empty': commonValidations.firstName.empty,
        'any.required': commonValidations.firstName.required,
        'string.pattern.base': 'Invalid MobileNumber'
    }),
    lastname: Joi.string().required().messages({
        'string.empty': commonValidations.lastName.empty,
        'any.required': commonValidations.lastName.required,
        'string.pattern.base': 'Invalid MobileNumber'
    }),
    email: Joi.string().required().email().messages({
        'string.empty': commonValidations.emailID.empty,
        'any.required': commonValidations.emailID.required,
        'string.pattern.base': 'Invalid email'
    }),
    
   
});

const roleSchema = Joi.object({
    name: Joi.string()
        .valid(...Object.values(RoleName))  // Enum validation here
        .required()
        .messages({
            'string.empty': commonValidations.role.empty,
            'any.required': commonValidations.role.required,
            'any.only': `Role must be one of [${Object.values(RoleName).join(', ')}]` // Custom message for invalid enum values
        }),
});





export const joiSchema = {
    userSchema,
    roleSchema,
   
}