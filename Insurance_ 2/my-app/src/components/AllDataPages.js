import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AllDataPage() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch the data from a mock API or backend
    axios.get('/api/employees')
      .then((response) => setData(response.data))
      .catch((error) => console.log(error));
  }, []);

  const filteredData = data.filter(item =>
    item.employeeId.includes(searchQuery)
  );

  return (
    <div>
      <h1>All Data</h1>
      <input
        type="text"
        placeholder="Search by Employee ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Insurance Type</th>
            <th>Department</th>
            <th>Type of Leave</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Car Number</th>
            <th>Insurance Company</th>
            <th>Premium</th>
            <th>Gross Premium</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(item => (
            <tr key={item.employeeId}>
              <td>{item.employeeId}</td>
              <td>{item.insuranceType}</td>
              <td>{item.department}</td>
              <td>{item.typeOfLeave}</td>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
              <td>{item.carNumber}</td>
              <td>{item.insuranceCompany}</td>
              <td>{item.premium}</td>
              <td>{item.grossPremium}</td>
              <td>{item.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllDataPage;
