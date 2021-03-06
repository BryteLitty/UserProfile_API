var express = require('express');
var router = express.Router();
// const objectID = require("mongodb").ObjectID;
const  ObjectID = require('mongodb').ObjectId;

const passport = require("passport")

/* GET users listing. */
router.get('/', (req, res, next) => {
  if(!req.isAuthenticated()){
    res.redirect("/login")
  }
  
  const users = req.app.locals.users;
  const _id = ObjectID(req.session.passport.user);

  users.findOne({ _id }, (err, results) => {
    if(err) {
      throw err
    } 

    res.render("account", { ...results });
    console.log(results)
  })

 
  
});

router.get("/:username", (req, res, next) => {

  const users = req.app.locals.users;
  const username = req.params.username;

  users.findOne({ username }, (err, results) => {
    if(err || !results){
      res.render("public-profile", { messages: {err: ["User not found"]}});
    }

    res.render("public-profile", {...results, username});
  });

});

router.post("/", (req, res, next) => {
  if(!req.isAuthenticated())  {
    res.redirect("/auth/login");
  }

  const users = req.app.locals.users;
  const {name, github, twitter, facebook} = req.body;
  const _id = ObjectID(req.session.passport.user);

  users.updateOne({ _id }, {$set: {name, github, twitter, facebook}}, (err) => {
    if(err){
      throw err;
    }
  });
  
  res.redirect("/users");

}); 

module.exports = router;
