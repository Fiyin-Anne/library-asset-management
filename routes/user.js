const router = require('express').Router(); //same as express.Router()
const mongoose = require('mongoose');
//const jwt = require('jsonwebtoken');
const User = require('../models/user');


const bcrypt = require('bcrypt');

router.get('/signin', (req, res) => {
    res.send({
        message: 'This is the signin page.'
    });
});

//check if the email being registered already exixts
router.post("/signup", (req, res, next) => {
  User.find({email: req.body.email }).exec()
  .then(user => {
    if (user.length >= 1) {
      return res.status(409).json({message: 'user already exists.'})
    } else {
      bcrypt.hash(req.body.password, 12, (err, hashPassword) => {
        if(err) {
          return res.status(500).json({
            error:err
          }); 
        } else {
          const newUser = new User({
            _id: mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hashPassword
        })
      newUser.save()
        .then(result => {
          console.log(result)
          res.status(201).json({message: 'User Created!'})
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({error: err})
        });
      }
      });
    }
  });
   next();
});

router.post("/login", (req, res, next) => {
  User.find({email: req.body.email })
  .exec()
  .then(user => {
    if(user.length < 1) {
      return res.status(401).json({message: 'Auth failed'}); //so hackers cant know if its the email or password that is wrong
    } 
    //compare hashed password with entered password
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if(err) {
        return res.status(401).json({message: 'Auth failed'});
      }
      if(result) {
        return res.status(200).json({message: 'Auth successful!'});
      }
      res.status(401).json({message: 'Auth failed'});
    })
    
  })
  .catch(err => {
    res.status(500).json({
      error:err
    });
  });
  next()
});


module.exports = router;