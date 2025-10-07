import express from "express";
import {
  getCars,
  addCar,
  updateCar,
  deleteCar,
} from "../controllers/rentCar.controller.js";

const router = express.Router();

router.get("/rentCar", getCars);
router.post("/", addCar);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);

export default router;
