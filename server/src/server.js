import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌾 AgroAI Agriculture Advisory Server running on port ${PORT}`);
  console.log(`🌾 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌾 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`🌾 Health Check: http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server gracefully.');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing HTTP server.');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

