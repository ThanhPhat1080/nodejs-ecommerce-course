import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`******* Server is running on port ${PORT} ********`);    
});

process.on("SIGINT", () => {
    console.log("\n\nSIGINT signal received: closing HTTP server");
    server.close(() => {
        console.log("\nHTTP server closed");
    });
});     

process.on("SIGTERM", () => {
  server.close(() => {
        console.log("\nServer closed");
  });
});
