import { Router } from "express";
import {
  bootstrapUser,
  getDashboard,
  getNotifications,
  getProducts,
  getUserMembership,
  readNotification,
  resolveProduct
} from "./user.controller.js";

const router = Router();

router.get("/bootstrap", bootstrapUser);
router.get("/dashboard", getDashboard);
router.get("/membership", getUserMembership);
router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", readNotification);
router.get("/products", getProducts);
router.post("/products/resolve", resolveProduct);

export default router;
