import express from "express";
import { getHotels, addHotel, updateHotel, deleteHotel } from "../controllers/hotelController.js";

router.get("/", (req, res) => {
  res.json({ message: "Hotel routes working!" });
});


const router = express.Router();
res.json({ message: "Hotel routes working!" });
router.get("/", getHotels);
router.post("/", addHotel);
router.put("/:id", updateHotel);
router.delete("/:id", deleteHotel);

export default router;
