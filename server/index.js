// Local server: npm start / npm run dev
import app, { ADMIN_ENABLED } from './app.js';

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!ADMIN_ENABLED) console.log('Admin is off: set ADMIN_PASSWORD in .env to turn it on');
});
