module.exports = server => {
  const io = require('socket.io')(server, { cookie: true });

  let students = {};
  let mentors = {};

  io.sockets.on('connection', socket => {
    console.log(socket.request.headers);
    let userId = socket.handshake.headers['user_id'];
    let userRole = socket.handshake.headers['user_role'];
    if (userRole === 'student') {
      students[userId] = socket;
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
};
