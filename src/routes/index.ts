
import authRoutes from "./Auth.route";
import adminRoutes from "./Admin.route";
import customerRoutes from "./Customer.route";
import { verifyUser } from "../Helper"
import { Router, type Application } from "express";


const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/customer", verifyUser as Application, customerRoutes);


export default router;