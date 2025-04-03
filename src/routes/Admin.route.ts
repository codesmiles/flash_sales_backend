import { Router, type Application } from "express";
import { createPromoController,createPromoProductController,createProductController,activePromoController } from "../Controller"
const router = Router();

router.get("/active-promo", activePromoController as Application);

router.post("/create-promo", createPromoController as Application);

router.post("/create-product", createProductController as Application);

router.post("/create-promo-product", createPromoProductController as Application);

export default router;