import express from 'express';
import { locationsRouter } from './locations/routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/locations', locationsRouter);

// Error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction,
  ) => {
    // Don't expose internal error details in production
    const message =
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message;

    res.status(500).json({
      error: message,
    });
  },
);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
