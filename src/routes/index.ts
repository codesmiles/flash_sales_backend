
import authRoutes from "./Auth.route";
import customerRoutes from "./Customer.route";
import { Router, type Application } from "express";
import { verifyUser } from "../Helper"


const router = Router();

router.use("/auth", authRoutes);
router.use("/customer", verifyUser as Application, customerRoutes);


export default router;