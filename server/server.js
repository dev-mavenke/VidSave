const app = require('./app');

const PORT = process.env.PORT || 5000;

// Backstop only - the download path handles its own failures. If something still
// slips through, log it rather than letting Node tear the process down.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
