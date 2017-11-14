const passport = require("passport");
const User = require('../models/User');
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(new GoogleStrategy({
  clientID: "442230536006-tnk8s3och4tsdmqoi1hij8t9loh7barf.apps.googleusercontent.com",
  clientSecret: "LYEOVLal4my-c0lc1veMUHYH",
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  User.findOne({ googleID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      googleID: profile.id,
      username: profile.displayName
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));
