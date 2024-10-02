import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import axios from 'axios';

// Function to format the date as DD-MMM-YYYY (30-Sep-2024)
const formatDisplayDate = (date) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-GB', options).replace(/ /g, '-');
};

function AddForm() {
  const [formData, setFormData] = useState({
    ID: "",
    Department: "",
    Insurance_Company: "",
    PREMIUM: "",
    Insurance_Type: "",
    Gross_Premium: "",
    Employee_Id: "",
    Start_Date: "",
    End_Date: "",
    Car_Number: "",
    Reason: "",
    Type_of_Leave: ""
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle change for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle date changes for Start Date and End Date
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value // Store raw date value for internal use
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert the dates to the desired format before submission
    const formattedStartDate = formatDisplayDate(formData.Start_Date);
    const formattedEndDate = formatDisplayDate(formData.End_Date);

    const payload = {
      ...formData,
      Start_Date: formattedStartDate,  // Formatted date
      End_Date: formattedEndDate       // Formatted date
    };

    try {
      const response = await axios.post('http://localhost:5000/api/submit', payload);
      console.log('Server response:', response);
      if (response.status === 200) {
        setSuccess('Form submitted successfully');
        setFormData({
          ID: "",
          Department: "",
          Insurance_Company: "",
          PREMIUM: "",
          Insurance_Type: "",
          Gross_Premium: "",
          Employee_Id: "",
          Start_Date: "",
          End_Date: "",
          Car_Number: "",
          Reason: "",
          Type_of_Leave: ""
        });
        setError('');
      }
    } catch (err) {
      if (err.response) {
        console.error('Server responded with an error: ', err.response.data);
      } else if (err.request) {
        console.error('No response received: ', err.request);
      } else {
        console.error('Error setting up the request: ', err.message);
      }
      setError('Failed to submit form');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} p={4} border={1} borderRadius={2} borderColor="grey.300" boxShadow={3}>
        <Typography variant="h4" gutterBottom>
          Add Employee Data
        </Typography>

        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Employee ID"
                name="Employee_Id"
                fullWidth
                variant="outlined"
                value={formData.Employee_Id}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="Department">Department</InputLabel>
                <Select
                  labelId="Department"
                  id="Department"
                  name="Department"
                  value={formData.Department}
                  onChange={handleChange}
                  label="Department"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Marketing<">Marketing</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Packaging">Packaging</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="Insurance_Type">Insurance Type</InputLabel>
                <Select
                  name="Insurance_Type"
                  labelId="Insurance_Type"
                  id="Insurance_Type"
                  value={formData.Insurance_Type}
                  onChange={handleChange}
                  label="Insurance Type"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Motor">Motor</MenuItem>
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Fire">Fire</MenuItem>
                  <MenuItem value="Cyber">Cyber</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Start Date"
                name="Start_Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={formData.Start_Date}  // Raw date value for input
                onChange={handleDateChange}  // Handle raw input change
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="End Date"
                name="End_Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={formData.End_Date}  // Raw date value for input
                onChange={handleDateChange}  // Handle raw input change
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Car Number"
                name="Car_Number"
                fullWidth
                variant="outlined"
                value={formData.Car_Number}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="Insurance_Company">Insurance Company</InputLabel>
                <Select
                  labelId="Insurance_Company"
                  id="insurance-company"
                  name="Insurance_Company"
                  value={formData.Insurance_Company}
                  onChange={handleChange}
                  label="Insurance Company"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="TATA-AIG GENERAL INSURANCE CO. LTD">TATA-AIG GENERAL INSURANCE CO. LTD</MenuItem>
                  <MenuItem value="BAJAJ ALLIANZ GENERAL INS. CO. LTD">BAJAJ ALLIANZ GENERAL INS. CO. LTD</MenuItem>
                  <MenuItem value="KOTAK GENERAL INSURANCE COMPANY">KOTAK GENERAL INSURANCE COMPANY</MenuItem>
                  <MenuItem value="IFFKO TOKIO GENERAL INSURANCE COMPANY">IFFKO TOKIO GENERAL INSURANCE COMPANY</MenuItem>
                  <MenuItem value="STAR HEALTH INSURANCE COMPANY">STAR HEALTH INSURANCE COMPANY</MenuItem>
                  <MenuItem value="CARE HEALTH INSURANCE">CARE HEALTH INSURANCE</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="Type_of_Leave">Type of Leave</InputLabel>
                <Select
                  labelId="Type_of_Leave"
                  id="Type_of_Leave"
                  name="Type_of_Leave"
                  value={formData.Type_of_Leave}
                  onChange={handleChange}
                  label="Type of Leave"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                  <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                  <MenuItem value="Public Leave">Public Leave</MenuItem> {/* Corrected typo */}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={6}>
              <TextField
                label="PREMIUM"
                name="PREMIUM"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.PREMIUM}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Gross Premium"
                name="Gross_Premium"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.Gross_Premium}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Reason"
                name="Reason"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={formData.Reason}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default AddForm;
