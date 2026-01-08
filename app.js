const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Load data from JSON file
let electricityData;

fs.readFile('electricity_usages.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    electricityData = JSON.parse(data).Sheet1; // Adjust based on your JSON structure
});

// API to get electricity usage of a specific province
app.get('/api/electricity/:province', (req, res) => {
    const province = req.params.province;
    const provinceData = electricityData.filter(item => item.Province_Name === province);

    if (provinceData.length === 0) {
        return res.status(404).json({ message: 'Province not found' });
    }

    res.json(provinceData);
});

// API to get total electricity usage (kWh) of a specific province
app.get('/api/electricity/total/:province', (req, res) => {
    const province = req.params.province;
    const provinceData = electricityData.filter(item => item.Province_Name === province);

    if (provinceData.length === 0) {
        return res.status(404).json({ message: 'Province not found' });
    }

    const totalUsage = provinceData.reduce((sum, item) => {
        for (const key in item) {
            if (key.endsWith('kWh')) {
                sum += parseFloat(item[key]) || 0;
            }
        }
        return sum;
    }, 0);

    res.json({ totalUsage });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});