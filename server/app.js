require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const downloadRoutes = require('./routes/downloadRoutes');

const app = express();

app.set('trust proxy', 1);

// CORS_ORIGIN is a comma-separated allowlist. Left unset (local dev) we stay
// permissive; in production it should name the deployed frontend origin.
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true
  })
);

app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use(
  '/api',
  rateLimit({
    windowMs: 60_000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please slow down and try again shortly.' }
  })
);

app.use('/api', downloadRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars -- Express identifies error middleware by arity.
app.use((err, req, res, next) => {
  const status = err.status || 500;

  if (!err.expected) {
    console.error(err);
  }

  if (res.headersSent) {
    res.destroy();
    return;
  }

  res.status(status).json({
    error: err.expected ? err.message : 'Something went wrong on our end.'
  });
});

module.exports = app;
