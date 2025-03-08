import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string;
        }
    }
}




class common {


    async hashPassword(password: string) {

        try {

            const hashedPassword = await bcrypt.hash(password, 10);
            return hashedPassword

        } catch (error) {
            return error
        }



    }


    async comparePassword(password: string, hashPassword: string) {

        try {

            let result = await bcrypt.compare(password, hashPassword)
            return result

        } catch (error) {
            return error
        }



    }

    async generatetoken(userid: any) {

        const token = jwt.sign({ userId: userid }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return token
    }

}

export default new common()