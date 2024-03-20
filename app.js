'use strict';

const express = require('express');
const startDatabase = require('./database');
const app = express();
const port =  process.env.PORT || 3000;
  
// set the view engine to ejs
app.set('view engine', 'ejs');
// parse body of incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', require('./routes/profile')());
app.use('/', require('./routes/account')());
app.use('/', require('./routes/comments')());
  
// start server
// Modified server start logic
async function startServer() {
    try {
        const db = await startDatabase();
        const server = app.listen(port, () => {
            console.log('Express started. Listening on %s', port);
        });
        return { server, db };
    } catch (error) {
        console.error('Error starting the server:', error);
        throw error;
    }
}

module.exports = {
    app,
    startServer
};