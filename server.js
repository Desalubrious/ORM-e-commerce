// Imports
const express = require('express');
const routes = require('./routes');
const app = express();
const sequelize = require('./config/connection');

// Set up the database connection
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Sync sequelize models
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    }
);
});
