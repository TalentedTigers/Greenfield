const { db, Ticket, User } = require('./index');
const _ = require('underscore');

const createTicket = (req, res) => {
  Ticket.create(req.body)
    .then(result => {
      if (!result) { throw result; }
      res.sendStatus(201);
    })
    .catch(() => {
      res.sendStatus(500);
    });
};

const findTickets = (req, res) => {
  let option = {};
  let query = req.query;
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

  Ticket.findAll({
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
  })
    .then(result => {
      console.log(result);
      if (!result) { throw result; }
      res.send(result);
    })
    .catch(() => { res.sendStatus(404); });
};

const updateTickets = (req, res) => {
  if (req.body.status === 'Claimed') {
    req.body.claimedAt = new Date();
  }
  if (req.body.status === 'Closed') {
    req.body.closedAt = new Date();
  }
  Ticket.update(req.body, { where: { id: req.params.id } })
    .then(ticket => {
      res.sendStatus(200);
    })
    .catch(err => {
      res.sendStatus(500);
    });
};

const createUser = (req, res) => {
  console.log(req.body);
  User.create(req.body)
    .then(result => {
      console.log('RESULT: ', result);
      if (!result) { throw result; }
      res.sendStatus(201);
    })
    .catch(() => { res.sendStatus(500); });
};

module.exports = {
  createTicket: createTicket,
  findTickets: findTickets,
  updateTickets: updateTickets,
  createUser: createUser
};
