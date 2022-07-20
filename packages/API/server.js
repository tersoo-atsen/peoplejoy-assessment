import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Get our API routes
import routes from './server/routes/patient.routes.js';

const app = express();

// use CORS
app.use(cors());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Application routes
app.use('/api/', routes);

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log('Server started on port', app.get('port'));
});

export default app;
