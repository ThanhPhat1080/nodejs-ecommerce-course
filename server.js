import app from './src/app.js';
import configEnv from './src/configs/config.env.js';

const port = configEnv.app.port;

const server = app.listen(port, () => {
  console.log(`Using NODE_ENV: ${process.env.NODE_ENV || 'dev'}`);
  console.log(`\n******* Server is running on port ${port} ********\n`);
});

process.on('SIGINT', () => {
  console.log('\n\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('\nHTTP server closed');
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('\nServer closed');
  });
});
