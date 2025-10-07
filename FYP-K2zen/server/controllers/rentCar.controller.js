import RentCar from "../models/rentCar.model.js";

// ✅ Get all cars
export const getCars = async (req, res) => {
  try {
    const cars = await RentCar.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars", error });
  }
};

// ✅ Add new car
export const addCar = async (req, res) => {
  try {
    const newCar = new RentCar(req.body);
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(500).json({ message: "Error adding car", error });
  }
};

// ✅ Update car
export const updateCar = async (req, res) => {
  try {
    const updated = await RentCar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating car", error });
  }
};

// ✅ Delete car
export const deleteCar = async (req, res) => {
  try {
    await RentCar.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car", error });
  }
};
