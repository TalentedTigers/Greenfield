const express = require('express');
const router = express.Router();
const db = require ('../../database/controller');
const { isAuthenticated, githubAuth } = require('./auth');

router.use(githubAuth.initialize());
router.use(githubAuth.session());
router.use(express.static(__dirname + '/../../client/'));

router.get('/api/auth/github', githubAuth.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/api/auth/github/callback', githubAuth.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

if (process.env.URL !== 'http://127.0.0.1:3000') {
  router.use(isAuthenticated);
}

router.get('/api/tickets', (req, res) => {
  db.findTickets(req.query).then(tickets => {
    if (!tickets.length) { return res.sendStatus(404); }
    res.send(tickets);
  });
});

router.get('/api/users/:id', (req, res) => {
  res.send(req.session.passport);
});

router.get('/api/tickets/:id', (req, res) => {

});

router.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/api/tickets', (req, res) => {
  db.createTicket(req.body).then(ticket => {
    if (!ticket) { return res.sendStatus(500); }
    res.sendStatus(201);
  });
});

router.put('/api/tickets/:id', (req, res) => {
  db.updateTickets(req.body, req.params.id).then(result => {
    if (!result) { return res.sendStatus(500); }
    res.sendStatus(200);
  });
});

router.post('/api/users', (req, res) => {
  db.createUser(req.body).then(result => {
    if (!result) { return res.sendStatus(500); }
    res.sendStatus(201);
  });
});

module.exports = router;
