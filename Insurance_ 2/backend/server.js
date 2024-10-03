const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
const corsOptions = {
    origin: 'https://assignment-alpha-two.vercel.app/',  // Allow requests from your React app running on this port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 204
  };
  
  app.use(cors(corsOptions));



// Read data from Zoho API
app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get(process.env.ZOHO_API_URL, {
      headers: { Authorization: `Zoho-oauthtoken 1000.d12b7350ccdc199cbe469bd9c6a9a0b8.e851843f1cb30497d9a9444216447cec` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Zoho:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Create data (already implemented in the code you provided)
app.post('/api/submit', async (req, res) => {
    try {
      console.log('Received request:', req.body);  // Log the received data
      const response = await axios.post(
        'https://creator.zoho.in/api/v2/dev_it/my-first-project/form/Approval_Request',
        { data: req.body },
        {
          headers: {
            Authorization: `Zoho-oauthtoken 1000.d12b7350ccdc199cbe469bd9c6a9a0b8.e851843f1cb30497d9a9444216447cec`,
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      console.log('Zoho API response:', response.data);  // Log the Zoho API response
      res.status(200).send(response.data);
    } catch (error) {
      console.error('Zoho API Error: ', error.response ? error.response.data : error.message);
      res.status(500).send({ message: 'Failed to submit form', details: error.message });
    }
  });
 
  

/// Update data in Zoho

app.put('/api/update/:ID', async (req, res) => {
    try {
      const ID = req.params.ID;  // Get ID from the route parameter
      const response = await axios.put(
        `https://creator.zoho.in/api/v2/dev_it/my-first-project/report/All_Leave_Requests/${ID}`, // Correct the URL to include the ID
        { data: req.body }, // Data from the request body to update
        {
          headers: {
            Authorization: `Zoho-oauthtoken 1000.d12b7350ccdc199cbe469bd9c6a9a0b8.e851843f1cb30497d9a9444216447cec`,
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      console.log(response.data);
      res.status(200).send(response.data);
    } catch (error) {
      console.error('Error updating data in Zoho:', error.response ? error.response.data : error.message);
      res.status(500).send({ message: 'Failed to update form' });
    }
});


  // Delete data from Zoho

app.delete('/api/delete/:ID', async (req, res) => {
    const ID  = req.params.ID; // Get the ID from the URL parameters
    try {
      const response = await axios.delete(
        `https://creator.zoho.in/api/v2/dev_it/my-first-project/report/All_Leave_Requests/${ID}`,  // Add the ID to the URL
        {
          headers: {
            Authorization: `Zoho-oauthtoken 1000.d12b7350ccdc199cbe469bd9c6a9a0b8.e851843f1cb30497d9a9444216447cec`,
          },
          timeout: 10000
        }
      );
      res.status(200).send({ message: 'Record deleted successfully' });
    } catch (error) {
      console.error('Error deleting data in Zoho:', error.response || error);
      res.status(500).send({ message: 'Failed to delete record' });
    }
});

  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
