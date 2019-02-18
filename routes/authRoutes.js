// Express router instance
const router = require("express").Router();
const passport = require("passport");

// auth login
router.get("/login", (req, res) => {
/** ADD LOGIN VIEW HERE **/
  res.redirect("/auth/google");
});

// auth logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
//  res.send("logout here") 

});

// auth with google
router.get("/google", passport.authenticate("google", {
  // array of user google profile items to access
  scope: ["profile"]

}));

// callback route for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/");
  
});

module.exports = router;
