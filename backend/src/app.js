import cors from 'cors';
import express from 'express';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'task-manager-backend' });
});

app.use('/api/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
