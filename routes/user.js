const router = require('express').Router(); //same as express.Router()
const mongoose = require('mongoose');
//const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//check if the email being registered already exixts
router.post("/signup", (req, res, next) => {
  User.find({email: req.body.email }).exec()
  .then(user => {
    if (user.length >= 1) {
      res.status(409).json({message: 'user already exists.'})
    } else {
      bcrypt.hash(req.body.password, 12, (err, hashPassword) => {
        if(err) {
           res.status(500).json({
            error:err
          }); 
        } else {
          const newUser = new User({
            _id: mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hashPassword,
            role: req.body.role
        })
        //User.role.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase())
      newUser.save()
        .then(result => {
          console.log(result)
          res.status(201).json({
            message: 'User Created!',
            id: req.body._id,
            user: req.body.email,
            role: req.body.role
            })
        })
        .catch(err => {
          res.status(500).json({error: err.message})
        });
      }
      });
    }
  });
   //next();
});

router.post("/login", (req, res, next) => {
  User.findOne({email: req.body.email })
  .exec()
  .then(user => {
    if(user.length < 1) {
      return res.status(401).json({message: 'Auth failed'});
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(err) {
        return res.status(401).json({message: 'Auth failed'});
      }
      if(result) {
        const token = jwt.sign({
          email: user.email,
          userId: user._id
        }, 
        process.env.TOKEN_SECRET,
        { expiresIn: '1h' }
        );
        return res.status(200).json({
          name: user.email,
          token: token});
      }
      return res.status(401).json({message: 'failed'});
    })
    
  })
  .catch(err => {
    res.status(500).json({
      error:err
    });
  });
  //next()
});


module.exports = router;
