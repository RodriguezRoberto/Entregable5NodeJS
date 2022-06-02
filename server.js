const { app } = require('./app');

const { initModels } = require('./models/initModels');

const { db } = require('./utils/database');

// Authenticate database credentials
db.authenticate()
.then( (  ) => console.log('Database authenticated') )
.catch( error => console.log( error ) );

initModels();

// Syncing sequelize models
db.sync()
.then( (  ) => console.log('Database synced') )
.catch( error => console.log( error ) );

// Spin up server
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const PORT = process.env.PORT || 4000;

app.listen( PORT, (  ) => {
    console.log( `Express app running on PORT: ${ PORT }` );
} );