
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());



const corsOptions = {
  origin: '*', // Allow requests from your React app running on this port
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
const TOKEN_REFRESH_BUFFER = 600 * 1000; // 10 minutes in milliseconds
let accessToken = process.env.ZOHO_ACCESS_TOKEN; // In-memory storage for access token
let tokenExpiryTime = Date.now() + 3600 * 1000; // Set token expiry time (1 hour)
let isRefreshing = false; // Flag to check if the token is being refreshed
let failedQueue = []; // Queue to store failed requests during the refresh process

// Function to process the failed requests after refreshing the token
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Function to refresh the access token
const refreshAccessToken = async () => {
  const currentTime = Date.now();

  // Check if the token is still valid with buffer time before it expires
  if (currentTime < tokenExpiryTime - TOKEN_REFRESH_BUFFER && accessToken) {
    // If the token is still valid, return the cached token
    return accessToken;
  }

  // If another refresh is already in progress, queue this request
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    // Request to refresh the access token
    const response = await axios.post(`https://accounts.zoho.in/oauth/v2/token`, null, {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token'
      }
    });

    accessToken = response.data.access_token; // Update the in-memory access token
    tokenExpiryTime = Date.now() + response.data.expires_in * 1000; // Update the expiry time
    isRefreshing = false;
    processQueue(null, accessToken); // Resolve all queued requests with the new token
    console.log('Access token refreshed:', accessToken);
    return accessToken;
  } catch (error) {
    isRefreshing = false;
    processQueue(error, null); // Reject all queued requests with the error
    console.error('Failed to refresh access token:', error);
    throw error;
  }
};

// Axios instance with interceptor to automatically refresh the token
const apiClient = axios.create();

apiClient.interceptors.request.use(
  async config => {
    const token = await refreshAccessToken(); // Ensure that we have a valid token before making the request
    config.headers['Authorization'] = `Zoho-oauthtoken ${token}`; // Set the token in the Authorization header
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response, // If the response is successful, return it
  async error => {
    const originalRequest = error.config;

    // If we get a 401 error, the token has expired
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Flag to avoid infinite retry loops
      console.log('Access token expired, refreshing...');
      try {
        const newAccessToken = await refreshAccessToken(); // Refresh the token
        originalRequest.headers['Authorization'] = `Zoho-oauthtoken ${newAccessToken}`; // Set the new token in the header
        return apiClient(originalRequest); // Retry the failed request with the new token
      } catch (err) {
        return Promise.reject(err); // If the token refresh fails, reject the request
      }
    }

    return Promise.reject(error); // For other errors, reject the request
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
            Authorization: `Zoho-oauthtoken  ${process.env.ZOHO_ACCESS_TOKEN}`,
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
            Authorization: `Zoho-oauthtoken  ${process.env.ZOHO_ACCESS_TOKEN}`,
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
