const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const db = require("../db/wezenDb");

passport.serializeUser( (user, done) => {
  // error or user app id
  done(null, user.appId);
});

passport.deserializeUser( (appId, done) => {
  db.select("user", {"appId": appId }, (users) => {
    done(null, users[0]);
  });
});

passport.use(
  // use Google+ API for auth
  new GoogleStrategy({
    // options for google strategy here
    callbackURL: "/auth/google/redirect",
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,

  }, (accessToken, refreshToken, profile, done) => {
    // passport callback function
    var record = {
      "userName": profile.displayName,
      "userId": profile.id,
      "thumbNail": profile._json.image.url,
    };

    db.select("user", { "userId": record.userId }, (existingUser) => {
      // check if user in not in db
      if(existingUser.length == 0) {
        // add user if needed
        db.insert("user", record, (newUser) => {
          // serialize new user
          done(null, newUser);
          console.log("New User", newUser);
        });
      // if user is already in db
      } else {
        // serialize existing user
        done(null, existingUser[0]);
        console.log("Existing User", existingUser);
      }
    })
  })
);
