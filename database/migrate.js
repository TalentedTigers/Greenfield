const { db, Ticket, User } = require('./index');
const sampleData = require('./sampleData');

db.sync({ force: true })
  .then(() => {
    User.bulkCreate(sampleData.users).then(() => {
      Ticket.bulkCreate(sampleData.tickets).then(() => {
        db.close();
      });
    });
  });
