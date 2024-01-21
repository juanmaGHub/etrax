const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const api = require('./routes/api');


require('dotenv').config();

const app = express();

const client_host = process.env.REACT_APP_SERVER || 'http://localhost';
const client_port = process.env.REACT_APP_PORT || 5173;
console.log(`${client_host}:${client_port}`);
app.use(cors(
    {
        origin: [`${client_host}:${client_port}`],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        
    }
));
// Set middleware of CORS 
app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://your-frontend.com"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader("Access-Control-Max-Age", 7200);
  
    next();
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API Routes
app.use('/', api);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
