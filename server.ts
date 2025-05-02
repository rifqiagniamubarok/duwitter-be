import { app } from './src/app/app';
import { logger } from './src/app/logging';

const PORT = 8080;

app.listen(PORT, () => {
  logger.info({ msg: `Server is running on http://localhost:${PORT}` });
  console.log(`Server is running on http://localhost:${PORT}`);
});
