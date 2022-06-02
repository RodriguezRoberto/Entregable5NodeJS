const express = require( 'express' );
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const { globalErrorHandler } = require('./controllers/errors.controller');

// Routers
const { usersRouter } = require( './routes/users.routes' );
const { repairsRouter } = require( './routes/repairs.routes' );

// Init express app
const app = express();

// Enable CORS
app.use(cors());

// Enable incoming JSON data
app.use(express.json());

//Add security headers
app.use(helmet());

//Compress responses
app.use(compression());

//Log incoming request
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Limit IP request
const limiter =  rateLimit({
    max: 10000,
    windowMs: 24 * 60 * 60 * 1000, //24h
    message: 'You can only make 10,000 requeest every 24h'
});

app.use(limiter);

app.use( '/api/v1/users', usersRouter );
app.use( '/api/v1/repairs', repairsRouter );

//Global error handler
app.use('*', globalErrorHandler);

module.exports = { app };
