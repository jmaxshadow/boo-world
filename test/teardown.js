module.exports = async () => {
    const server = global.__SERVER__;
    const db = global.__DB__;
    await db.close();
    await server.close();
}