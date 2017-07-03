'use strict';

var _require = require('../../database/'),
    db = _require.db,
    Ticket = _require.Ticket,
    User = _require.User;

var util = require('../../helpers/util');

module.exports = function (server) {
  var io = require('socket.io')(server, { cookie: true });

  var students = {};
  var mentors = {};
  var admins = {};

  io.on('connection', function (socket) {
    var id = socket.handshake.query.id;
    var role = socket.handshake.query.role;

    if (role === 'student') {
      !students[id] ? students[id] = [socket] : students[id].push(socket);
    } else if (role === 'mentor') {
      !mentors[id] ? mentors[id] = [socket] : mentors[id].push(socket);
    } else if (role === 'admin') {
      !admins[id] ? admins[id] = [socket] : admins[id].push(socket);
    }

    socket.join(id);

    io.emit('user connect', util.connectionCount(students, mentors, admins));

    console.log(Object.keys(students).length + ' students connected');
    console.log(Object.keys(mentors).length + ' mentors connected');
    console.log(Object.keys(admins).length + ' admins connected');

    socket.on('refresh', function () {
      return io.emit('update or submit ticket');
    });

    socket.on('get wait time', function () {
      Ticket.findAll().then(function (tickets) {
        var response = { waitTime: util.computeAvgWaitTime(tickets, mentors, id) };
        console.log('this is the response est wait time!: ', response);
        socket.emit('new wait time', response);
      });
    });

    socket.on('update adminStats', function () {
      var openedTickets, closedTickets = 0;
      Ticket.count({ where: { status: 'Opened' } }).then(function (numOpenTickets) {
        openedTickets = numOpenTickets;
        return Ticket.count({
          where: {
            status: 'Closed',
            closedAt: { $gt: new Date(new Date() - 24 * 60 * 60 * 1000) }
          }
        });
      }).then(function (numCloseTickets) {
        closedTickets = numCloseTickets;
        io.emit('new adminStats', {
          open: openedTickets,
          closed: closedTickets
        });
      });
    });

    // logic has flaws
    // socket.on('update adminStats', () => {
    //   Ticket.findAll({ where: { createdAt: { $gt: new Date(new Date() - 24 * 60 * 60 * 1000) } } })
    //     .then(result => {
    //       io.emit('new adminStats', util.getAdminStats(result));
    //     });
    // });

    socket.on('disconnect', function (socket) {
      if (role === 'student') {
        students[id].length <= 1 ? delete students[id] : students[id].splice(students[id].indexOf(socket), 1);
      } else if (role === 'mentor') {
        mentors[id].length <= 1 ? delete mentors[id] : mentors[id].splice(mentors[id].indexOf(socket), 1);
      } else if (role === 'admin') {
        admins[id].length <= 1 ? delete admins[id] : admins[id].splice(admins[id].indexOf(socket), 1);
      }

      io.emit('user disconnect', util.connectionCount(students, mentors, admins));

      console.log('Disconnected, now ' + Object.keys(students).length + ' students connected');
      console.log('Disconnected, now ' + Object.keys(mentors).length + ' mentors connected');
      console.log('Disconnected, now ' + Object.keys(admins).length + ' admins connected');
    });
  });
};