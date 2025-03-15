import authRoutes from "./Auth.route";
import { Router } from "express";


const router = Router();

router.use("/auth", authRoutes);

console.log("hello routes")


export default router;