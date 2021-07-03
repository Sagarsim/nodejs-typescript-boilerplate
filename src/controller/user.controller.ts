import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../model/user.model";
import log from "../logger";
import config from "config";
export default class UserController {
    static addUser = async (req: Request, res: Response, next: NextFunction) => {
        let userObj = req.body;
        let user = new User();
        Object.keys(userObj).map(key => {
            user[key] = userObj[key]
        })
        const errors = await validate(user, {validationError: {target: false, value: false}})
        if(errors.length > 0){
            log.error(errors);
            return next({status: 400, message:config.get("defaultError") as string, error: errors})
        }
        const userRepository = getRepository(User)
        try{
            await userRepository.save(user)
        }catch(err){
            return next(err)
        }
        res.status(201).send("User created");
    }

}