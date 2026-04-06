import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.json';

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import recordRoutes from './routes/records.routes';
import analyticsRoutes from './routes/analytics.routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Setup Swagger Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error handler
app.use(errorHandler);

export default app;
