const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const api = require('./routes/api');


require('dotenv').config();

const app = express();

const client_host = process.env.REACT_APP_SERVER || 'http://localhost';
const client_port = process.env.REACT_APP_PORT || 5173;
app.use(cors(
    {
        origin: [`${client_host}:${client_port}`],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API Routes
app.use('/', api);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));