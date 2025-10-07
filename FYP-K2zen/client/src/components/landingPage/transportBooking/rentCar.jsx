import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import axios from "axios";
import "./rentCar.scss";

export default function TransportBooking() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/rentCar")
      .then((res) => setCars(res.data))
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  return (
    <Box className="transport-section">
      <div className="section-header">
        <Typography variant="h3" className="section-title">
          Transport Booking
        </Typography>
        <Typography className="section-subtitle">
          Choose from our premium vehicles with professional drivers for a safe journey.
        </Typography>
      </div>

      <div className="car-row">
        {cars.map((car) => (
          <Card className="transport-card" key={car._id}>
            <div className="car-image">
              <img src={car.image} alt={car.carName} />
            </div>
            <CardContent className="car-content">
              <Typography variant="h6" className="car-title">
                {car.carName}
              </Typography>
              <Typography className="car-details">Model: {car.model}</Typography>
              <Typography className="car-details">Driver: {car.driverName}</Typography>
              <Typography className="car-details">Location: {car.location}</Typography>
              <Typography className="car-details">Status: {car.status}</Typography>
              <Button className="car-btn">Book Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Box>
  );
}
