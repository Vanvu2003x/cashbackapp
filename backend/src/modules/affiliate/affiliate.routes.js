import { Router } from "express";
import { convertLink, detectPlatform } from "./affiliate.controller.js";

const router = Router();

router.post("/convert", convertLink);
router.post("/detect", detectPlatform);

export default router;
