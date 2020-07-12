const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Book = require('../models/book');
const jwt = require('jsonwebtoken');
const {loginAuth, adminAuth } = require('../middleware');

router.post('/login', (req, res) => {
  User.findOne({email: req.body.email})
  .exec()
  .then(user => {
    let isAdmin = user.role === 'admin';
    if(user.role !== 'admin') {
      return res.status(401).json({isAdmin: isAdmin, message: 'Access not granted.'});
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(err) {
        return res.status(401).json({message: 'Access not granted'});
      }
      if(result) {
          const token = jwt.sign({
            email: user.email,
            isAdmin: isAdmin,
            userId: user._id
          }, 
          process.env.TOKEN_SECRET,
          { expiresIn: '1h' }
          );
        return res.header('Authorization', 'Bearer '+ token).status(200).json({
          message: 'Welcome Admin.',
          name: user.email,
          role: user.role,
          token: token});
      }
      return res.status(401).json({message: 'Access not granted'});
    })
    
  })
  .catch(err => {
    res.status(500).json({
      error:err
    });
  });
});


//Add new book
router.post('/addBook', loginAuth, adminAuth, (req, res) => {
  Book.findOne({title: req.body.title, author: req.body.author})
  .exec()
  .then(book => {
    if(book) {
      return res.status(409).json({message: 'Duplicate copy'});
    }
    console.log('Admin is adding a new book...');
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      shelf: req.body.shelf,
      numAvailable: req.body.numAvailable
    })
    newBook.save()
      .then(result => {
        console.log(result)
        res.status(201).json({
        message: 'Book added...',
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
        shelf: req.body.shelf,
        numAvailable: req.body.numAvailable
        })
    })
    .catch(err => {
      res.status(500).json({error: err.message})
    });
  })
})


module.exports = router;