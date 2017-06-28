const passport = require('passport');
const Strategy = require('passport-github').Strategy;
const db = require ('../../database/');
require('dotenv').config();

passport.use(new Strategy({
  clientID: process.env.GITHUB_CLIENTID,
  clientSecret: process.env.GITHUB_CLIENTSECRET,
  callbackURL: `${process.env.URL}/api/auth/github/callback`
}, (accessToken, refreshToken, profile, callback) => {
  db.User.find({
    where: { username: profile.username }
  }).then(user => {
    if (!user) { return callback('Can\'t find user in database'); }
    return callback(null, user.dataValues);
  });
}));

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  db.User.find({
    where: { username: user.username }
  }).then(user => {
    if (!user) { return callback('failed'); }
    callback(null, user.dataValues);
  });
});

module.exports = passport;
