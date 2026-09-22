import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.routes.js';
import { isBrowserRequest, browserHtmlPage, getClientIp } from '#utils/request.js';
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.get('/', (req, res) => {
  const clientIp = getClientIp(req);
  logger.info(`Hello World route accessed by client IP: ${clientIp}`);

  if (isBrowserRequest(req)) {
    return res.status(200).type('html').send(browserHtmlPage(clientIp));
  }

  return res.status(200).send(`Your IP: ${clientIp}`);
});

app.get('/health', (req, res) => {
  const clientIp = getClientIp(req);
  logger.info(`Health check route accessed by client IP: ${clientIp}`);

  return res.status(200).json({ status: 'UP', clientIp, timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.get('/api', (req, res) => {
  const clientIp = getClientIp(req);
  logger.info(`API route accessed by client IP: ${clientIp}`);
  return res.status(200).json({ message: 'Welcome to the API!', clientIp });
});

app.use('/api/auth', authRoutes);

export default app;
