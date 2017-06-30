const { db, Ticket, User } = require('./index');
const _ = require('underscore');

const createTicket = (ticket) => {
  return Ticket.create(ticket);
};

const findTickets = (query) => {
  let option = {};
  if (query.role === 'student') {
    option = { userId: query.id };
  } else if (query.role === 'mentor') {
    option = {
      status: ['Opened', 'Claimed'],
      $or: [{ claimedBy: query.id }, { claimedBy: null }]
    };
  } else if (query.role === 'admin') {
    option = _.omit(query, ['id', 'role']);
  }

  const otherfunction = function(status) {
    console.log('test', status);
    return status;
  };

  return Ticket.findAll({
    where: option,
    include: [ { model: User } ],
    order: [
      [db.literal(`CASE
        WHEN status = 'Claimed' THEN 1
        WHEN status = 'Opened' THEN 2
        WHEN status = 'Closed' THEN 3
        END`
      )],
      ['updatedAt', 'DESC']
    ]
  });
};

const updateTickets = (body, id) => {
  if (body.status === 'Claimed') {
    body.claimedAt = new Date();
  }
  if (body.status === 'Closed') {
    body.closedAt = new Date();
  }
  return Ticket.update(body, { where: { id: id } });
};

const createUser = (user) => {
  return User.create(user);
};

module.exports = {
  createTicket: createTicket,
  findTickets: findTickets,
  updateTickets: updateTickets,
  createUser: createUser
};
