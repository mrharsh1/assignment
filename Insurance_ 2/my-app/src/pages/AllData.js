import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const AllData = () => {
  const [employeeData, setEmployeeData] = useState([]); // Ensure employeeData is initialized as an empty array
  const [searchQuery, setSearchQuery] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    ID: "",
    Employee_Id: '',
    Insurance_Type: '',
    Department: '',
    Start_Date: '',
    End_Date: '',
    Car_Number: '',
    Insurance_Company: '',
    PREMIUM: '',
    Gross_Premium: '',
    Reason: '',
  });

  const formatDate = (dateInput) => {
    const date = new Date(dateInput);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    return formattedDate.replace(/(\d{2})\s(\w{3})\s(\d{4})/, '$1-$2-$3');
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get('https://assignment-05q5.onrender.com/api/data');
      setEmployeeData(response.data.data || []); // Ensure that employeeData is always an array
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredData = (employeeData || []).filter(row => // Ensure that employeeData is an array before calling filter
    row.Employee_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.Insurance_Type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.Department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(employeeData[index]); // Set the form data to the selected row's data
  };

  const handleUpdate = async () => {
    try {
      const formattedStartDate = formatDate(formData.Start_Date);
      const formattedEndDate = formatDate(formData.End_Date);

      const updatedFormData = {
        ...formData,
        Start_Date: formattedStartDate,
        End_Date: formattedEndDate,
      };

      await axios.put(`https://assignment-05q5.onrender.com/api/update/${formData.ID}`, updatedFormData);
      fetchEmployeeData();
      setEditIndex(null); // Reset edit index to close edit form
      setFormData({
        ID: "",
        Employee_Id: '',
        Insurance_Type: '',
        Department: '',
        Start_Date: '',
        End_Date: '',
        Car_Number: '',
        Insurance_Company: '',
        PREMIUM: '',
        Gross_Premium: '',
        Reason: '',
      });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async (ID) => {
    try {
      await axios.delete(`https://assignment-05q5.onrender.com/api/delete/${ID}`);
      fetchEmployeeData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <Box p={3}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Insurance Type</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Car Number</TableCell>
              <TableCell>Insurance Company</TableCell>
              <TableCell>Premium</TableCell>
              <TableCell>Gross Premium</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.ID}</TableCell>
                <TableCell>{row.Employee_Id}</TableCell>
                <TableCell>{row.Insurance_Type}</TableCell>
                <TableCell>{row.Department}</TableCell>
                <TableCell>{row.Start_Date}</TableCell>
                <TableCell>{row.End_Date}</TableCell>
                <TableCell>{row.Car_Number}</TableCell>
                <TableCell>{row.Insurance_Company}</TableCell>
                <TableCell>{row.PREMIUM}</TableCell>
                <TableCell>{row.Gross_Premium}</TableCell>
                <TableCell>{row.Reason}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(index)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row.ID)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editIndex !== null && (
        <Box mt={4}>
          <h3>Edit Employee Data</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              label="Employee ID"
              name="Employee_Id"
              value={formData.Employee_Id}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '10px' }}
              disabled
            />
            <TextField
              label="Insurance Type"
              name="Insurance_Type"
              value={formData.Insurance_Type}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Department"
              name="Department"
              value={formData.Department}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Start Date"
              name="Start_Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={formData.Start_Date}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="End Date"
              name="End_Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={formData.End_Date}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Car Number"
              name="Car_Number"
              value={formData.Car_Number}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Insurance Company"
              name="Insurance_Company"
              value={formData.Insurance_Company}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Premium"
              name="PREMIUM"
              value={formData.PREMIUM}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Gross Premium"
              name="Gross_Premium"
              value={formData.Gross_Premium}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Reason"
              name="Reason"
              value={formData.Reason}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              style={{ marginBottom: '10px' }}
            />
            <Button type="button" variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default AllData;
