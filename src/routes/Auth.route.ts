import { Router, type Application } from "express";
import {createUser,loginUser,forgotPassword,resetPassword} from "../Controller"
const router = Router();

// your route implementation here
router.post("/create",  createUser as Application);

router.post("/login", loginUser as Application);

router.post("/forgot-password", forgotPassword as Application)

router.patch("/reset-password", resetPassword as Application)


export default router;