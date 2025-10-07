import mongoose from "mongoose";

const RentCar = new mongoose.Schema(
  {
    carName: { type: String, required: true },
    model: { type: String, required: true },
    description: { type: String, required: true },
    driverName: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["Available", "Booked"], required: true },
    image: { type: String, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model("RentCar", RentCar);
