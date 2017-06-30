const db = require ('../../database/controller');
const util = require('../helpers/util');

module.exports = server => {
  const io = require('socket.io')(server, { cookie: true });
  const students = {};
  const mentors = {};
  const admins = {};

  io.on('connection', socket => {
    let id = socket.handshake.query.id;
    let role = socket.handshake.query.role;

    if (role === 'student') {
      !students[id] ? students[id] = [socket] : students[id].push(socket);
    } else if (role === 'mentor') {
      !mentors[id] ? mentors[id] = [socket] : mentors[id].push(socket);
    } else if (role === 'admin') {
      !admins[id] ? admins[id] = [socket] : admins[id].push(socket);
    }

    console.log(`${Object.keys(students).length} connected`);
    console.log(`${Object.keys(mentors).length} connected`);

    socket.on('refresh', () => io.emit('update or submit ticket'));

    socket.on('disconnect', socket => {
      if (role === 'student') {
        students[id].length <= 1 ? delete students[id] : students[id].splice(students[id].indexOf(socket), 1);
      } else if (role === 'mentor') {
        mentors[id].length <= 1 ? delete mentors[id] : mentors[id].splice(mentors[id].indexOf(socket), 1);
      } else if (role === 'admin') {
        admins[id].length <= 1 ? delete admins[id] : admins[id].splice(admins[id].indexOf(socket), 1);
      }
      console.log(`Disconnected, now ${Object.keys(students).length} connected`);
      console.log(`Disconnected, now ${Object.keys(mentors).length} connected`);
    });
  });
};
