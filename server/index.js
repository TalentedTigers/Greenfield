const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const middleware = require('./middleware');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

app.use(middleware.router);

middleware.socketIO(server);

server.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));
