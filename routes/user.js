const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post("/signup", (req, res) => {
  User.findOne({email: req.body.email })
  .exec()
  .then(user => {
    if (user) {
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
});

router.post("/login", (req, res) => {
  User.findOne({email: req.body.email })
  .exec()
  .then(user => {
    if(!user) {
      return res.status(401).json({message: 'Auth failed'});
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(err) {
        return res.status(401).json({message: 'Auth failed'});
      }
      if(result) {
        const token = jwt.sign({
          email: user.email,
          userId: user._id,
          isAdmin: user.role === 'admin'
        }, 
        process.env.TOKEN_SECRET,
        { expiresIn: '1h' }
        );
        return res.header('Authorization', 'Bearer '+ token).status(200).json({
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
});


module.exports = router;
