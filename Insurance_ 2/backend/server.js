
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from your React app running on this port
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`https://accounts.zoho.com/oauth/v2/token`, null, {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token'
      }
    });
    // Update the access token in the environment variables (or use in-memory variable)
    process.env.ZOHO_ACCESS_TOKEN = response.data.access_token;
    console.log('Access token refreshed:', process.env.ZOHO_ACCESS_TOKEN);
    return response.data.access_token;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error;
  }
};

// Axios instance with interceptor to automatically refresh the token
const apiClient = axios.create();

apiClient.interceptors.response.use(
  response => response, // If the response is successful, return it
  async error => {
    if (error.response && error.response.status === 401) { // If the access token has expired
      console.log('Access token expired, refreshing...');
      const newAccessToken = await refreshAccessToken(); // Refresh the token
      error.config.headers['Authorization'] = `Zoho-oauthtoken ${newAccessToken}`; // Set the new token in the header
      return apiClient.request(error.config); // Retry the failed request with the new token
    }
    return Promise.reject(error); // If the error is something else, reject it
  }
);

// Example of using the apiClient to fetch data from Zoho
app.get('/api/data', async (req, res) => {
  try {
    const response = await apiClient.get(process.env.ZOHO_API_URL, {
      headers: { Authorization: `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Zoho:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Post, put, delete handlers will use the same apiClient with auto-refresh

app.post('/api/submit', async (req, res) => {
  try {
    const response = await apiClient.post(
      'https://creator.zoho.in/api/v2/dev_it/my-first-project/form/Approval_Request',
      { data: req.body },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Zoho API Error:', error.response ? error.response.data : error.message);
    res.status(500).send({ message: 'Failed to submit form', details: error.message });
  }
});

// Other API routes here (update, delete)

  // Delete data from Zoho

app.delete('/api/delete/:ID', async (req, res) => {
    const ID  = req.params.ID; // Get the ID from the URL parameters
    try {
      const response = await axios.delete(
        `https://creator.zoho.in/api/v2/dev_it/my-first-project/report/All_Leave_Requests/${ID}`,  // Add the ID to the URL
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
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
/// Update data in Zoho

app.put('/api/update/:ID', async (req, res) => {
    try {
      const ID = req.params.ID;  // Get ID from the route parameter
      const response = await axios.put(
        `https://creator.zoho.in/api/v2/dev_it/my-first-project/report/All_Leave_Requests/${ID}`, // Correct the URL to include the ID
        { data: req.body }, // Data from the request body to update
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
