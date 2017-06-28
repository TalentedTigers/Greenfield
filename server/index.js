const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const router = require('./router');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(router);

server.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));

let students = [];
let mentors = {};

io.sockets.on('connection', socket => {
  let userId = socket.handshake.headers['user_id'];
  let userRole = socket.handshake.headers['user_role'];
  if (userRole === 'student') {
    students.push(socket);
  } else if (userRole === 'mentor') {
    mentors[userId] = socket;
  }
  console.log(`there are ${students.length} students and ${mentors.length} mentors connected`);

  socket.on('disconnect', () => {
    if (userRole === 'student') {
      delete students[userId];
    } else if (userRole === 'mentor') {
      delete mentors[userId];
    }
    console.log(`Disconnected, there are ${students.length} students and ${mentors.length} mentors connected`);
  });
});
