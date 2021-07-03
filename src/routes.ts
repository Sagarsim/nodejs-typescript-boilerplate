import {Router} from "express";
import UserController from "./controller/user.controller";
const router = Router();

router.post("/user", UserController.addUser);

export default router;