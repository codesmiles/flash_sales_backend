import authRoutes from "./Auth.route";
import { Router } from "express";


const router = Router();

router.use("/auth", authRoutes);


export default router;