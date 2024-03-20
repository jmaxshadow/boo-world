const { startServer, app } = require('../app'); // Adjust this path to where your Express app is initialized

module.exports = async () => {
    const result = await startServer(); // Start the server and store the instance
    global.__SERVER__ = result.server;
    global.__DB__ = result.db;
    global.__APP__ = app;
};