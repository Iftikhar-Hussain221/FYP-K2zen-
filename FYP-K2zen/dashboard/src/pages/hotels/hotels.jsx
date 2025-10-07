import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Typography, Avatar, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    image: null, // file instead of string
    status: "Available",
  });

  // ✅ Fetch from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/hotels")
      .then((res) => setHotels(res.data))
      .catch((err) => console.error("Error fetching hotels:", err));
  }, []);

  // ✅ View Hotel
  const handleView = (hotel) => {
    setSelectedHotel(hotel);
    setOpenView(true);
  };

  // ✅ Edit Hotel
  const handleEdit = (hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      name: hotel.name,
      description: hotel.description,
      location: hotel.location,
      image: null, // image file not prefilled
      status: hotel.status,
    });
    setOpenEdit(true);
  };

  // ✅ Add Hotel
  const handleAdd = () => {
    setFormData({ name: "", description: "", location: "", image: null, status: "Available" });
    setOpenAdd(true);
  };

  // ✅ Save Edited Hotel
  const handleSaveEdit = async () => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      const res = await axios.put(
        `http://localhost:5000/api/hotels/${selectedHotel._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setHotels(hotels.map((h) => (h._id === selectedHotel._id ? res.data : h)));
      setOpenEdit(false);
    } catch (err) {
      console.error("Error updating hotel:", err);
    }
  };

  // ✅ Add New Hotel
  const handleSaveAdd = async () => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      const res = await axios.post("http://localhost:5000/api/hotels", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setHotels([...hotels, res.data]);
      setOpenAdd(false);
    } catch (err) {
      console.error("Error adding hotel:", err);
    }
  };

  // ✅ Delete Hotel
  const handleDelete = async (hotel) => {
    try {
      await axios.delete(`http://localhost:5000/api/hotels/${hotel._id}`);
      setHotels(hotels.filter((h) => h._id !== hotel._id));
    } catch (err) {
      console.error("Error deleting hotel:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>Hotels List</Typography>

      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
        Add New Hotel
      </Button>

      {/* Table */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Hotel Name</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Location</b></TableCell>
              <TableCell><b>Image</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell align="center"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow key={hotel._id}>
                <TableCell>{hotel.name}</TableCell>
                <TableCell>{hotel.description}</TableCell>
                <TableCell>{hotel.location}</TableCell>
                <TableCell>
                  <Avatar src={hotel.image} alt={hotel.name} variant="rounded" sx={{ width: 56, height: 56 }} />
                </TableCell>
                <TableCell>{hotel.status}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleView(hotel)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleEdit(hotel)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(hotel)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Modal */}
      <Dialog open={openView} onClose={() => setOpenView(false)}>
        <DialogTitle>Hotel Details</DialogTitle>
        <DialogContent>
          {selectedHotel && (
            <>
              <p><b>Name:</b> {selectedHotel.name}</p>
              <p><b>Description:</b> {selectedHotel.description}</p>
              <p><b>Location:</b> {selectedHotel.location}</p>
              <p><b>Status:</b> {selectedHotel.status}</p>
              <Avatar src={selectedHotel.image} sx={{ width: 100, height: 100 }} />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Hotel</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            style={{ marginTop: "10px" }}
          />
          <TextField
            margin="dense"
            label="Status"
            fullWidth
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Modal */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add New Hotel</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            style={{ marginTop: "10px" }}
          />
          <TextField
            margin="dense"
            label="Status"
            fullWidth
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Hotels;
