import { asyncHandler } from "../../utils/asyncHandler.js";
import * as affiliateService from "./affiliate.service.js";

export const convertLink = asyncHandler(async (req, res) => {
  const result = await affiliateService.convertLink(req.body);
  res.status(200).json({
    success: true,
    data: result
  });
});

export const detectPlatform = asyncHandler(async (req, res) => {
  const { originUrl } = req.body;
  const platform = affiliateService.detectPlatform(originUrl);
  res.status(200).json({
    success: true,
    data: platform
  });
});
