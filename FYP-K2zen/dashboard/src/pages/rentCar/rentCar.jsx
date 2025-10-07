import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const RentCar = () => {
  const [cars, setCars] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [viewingCar, setViewingCar] = useState(null);

  // ✅ Fetch Cars from API
  useEffect(() => {
    axios.get("http://localhost:5000/api/rentCar")
      .then((res) => setCars(res.data))
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  const validationSchema = Yup.object({
    carName: Yup.string().required("Car name is required"),
    model: Yup.string().required("Model is required"),
    description: Yup.string().required("Description is required"),
    driverName: Yup.string().required("Driver name is required"),
    location: Yup.string().required("Location is required"),
    status: Yup.string().required("Status is required"),
    image: Yup.mixed().required("Image is required"),
  });

  const initialValues = {
    carName: "",
    model: "",
    description: "",
    driverName: "",
    location: "",
    status: "",
    image: null,
  };

  // ✅ Add or Update Car
  const onSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }

      // Append file (if image is a File object)
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      if (editingCar) {
        const res = await axios.put(
          `http://localhost:5000/api/rentCar/${editingCar._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setCars(cars.map((car) => (car._id === editingCar._id ? res.data : car)));
      } else {
        const res = await axios.post("http://localhost:5000/api/rentCar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCars([...cars, res.data]);
      }

      resetForm();
      setOpenForm(false);
      setEditingCar(null);
    } catch (error) {
      console.error("Error submitting car:", error);
    }
  };

  const handleDelete = async (car) => {
    try {
      await axios.delete(`http://localhost:5000/api/rentCar/${car._id}`);
      setCars(cars.filter((c) => c._id !== car._id));
    } catch (err) {
      console.error("Error deleting car:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>Rent Car List</Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditingCar(null);
          setOpenForm(true);
        }}
        style={{ marginBottom: "20px" }}
      >
        Add New Car
      </Button>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Car Name</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Driver Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars.map((car) => (
              <TableRow key={car._id}>
                <TableCell>{car.carName}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.description}</TableCell>
                <TableCell>{car.driverName}</TableCell>
                <TableCell>{car.location}</TableCell>
                <TableCell>
                  <Avatar src={car.image} variant="rounded" sx={{ width: 56, height: 56 }} />
                </TableCell>
                <TableCell>{car.status}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => { setViewingCar(car); setOpenView(true); }}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => { setEditingCar(car); setOpenForm(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(car)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Form */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCar ? "Edit Car" : "Add New Car"}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={editingCar || initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }}>
                {["carName", "model", "driverName", "location"].map((field) => (
                  <div key={field}>
                    <label><b>{field}</b></label>
                    <Field
                      name={field}
                      type="text"
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                    <ErrorMessage name={field} component="div" style={{ color: "red", fontSize: "13px" }} />
                  </div>
                ))}

                {/* Description */}
                <div>
                  <label><b>Description</b></label>
                  <Field
                    name="description"
                    as="textarea"
                    rows="3"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      resize: "none",
                    }}
                  />
                  <ErrorMessage name="description" component="div" style={{ color: "red", fontSize: "13px" }} />
                </div>

                {/* ✅ Image Upload Field */}
                <div>
                  <label><b>Image</b></label>
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("image", file);
                    }}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                  <ErrorMessage name="image" component="div" style={{ color: "red", fontSize: "13px" }} />
                </div>

                {/* Status */}
                <div>
                  <label><b>Status</b></label>
                  <Field as="select" name="status" style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
                    <option value="">Select Status</option>
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                  </Field>
                  <ErrorMessage name="status" component="div" style={{ color: "red", fontSize: "13px" }} />
                </div>

                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  {editingCar ? "Update Car" : "Add Car"}
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Car Details</DialogTitle>
        <DialogContent>
          {viewingCar && (
            <div style={{ padding: "10px", lineHeight: "1.8" }}>
              <p><b>Car Name:</b> {viewingCar.carName}</p>
              <p><b>Model:</b> {viewingCar.model}</p>
              <p><b>Description:</b> {viewingCar.description}</p>
              <p><b>Driver:</b> {viewingCar.driverName}</p>
              <p><b>Location:</b> {viewingCar.location}</p>
              <p><b>Status:</b> {viewingCar.status}</p>
              <Avatar src={viewingCar.image} sx={{ width: 100, height: 100, marginTop: "10px" }} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RentCar;
