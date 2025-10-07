import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./hotels.scss";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/hotels")
      .then((res) => setHotels(res.data))
      .catch((err) => console.error("Error loading hotels:", err));
  }, []);

  const handleBookHotel = (hotel) => {
    navigate("/hotelbooking", { state: { hotel } });
  };

  return (
    <Box className="hotels-section">
      <Typography variant="h3" className="section-title" align="center" marginTop="5%">
        Featured Hotels
      </Typography>
      <Grid container spacing={4}>
        {hotels.map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel._id}>
            <Card className="hotel-card">
              <CardMedia component="img" image={hotel.image} alt={hotel.name} />
              <CardContent>
                <Typography variant="h6">{hotel.name}</Typography>
                <Typography variant="body2" color="text.secondary">{hotel.description}</Typography>
                <Typography variant="subtitle2" color="text.secondary">{hotel.location}</Typography>
                <Button onClick={() => handleBookHotel(hotel)} variant="contained" sx={{ mt: 1 }}>
                  Explore & Book
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
