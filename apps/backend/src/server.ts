import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = Number(process.env.PORT ?? 4000);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`RiskPulse AI backend listening on http://localhost:${port}`);
  });
}

export default app;
