import { Router, type Application } from "express";
import { purchase_product,purchase_promo_product, available_promo_product } from "../Controller"
const router = Router();


router.post("/purchase", purchase_product as Application);

router.post("/purchase-promo", purchase_promo_product as Application);

router.get("/available-promo", available_promo_product as Application);


export default router;