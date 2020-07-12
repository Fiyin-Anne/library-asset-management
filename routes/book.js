//List all books

//return a particular book based on title

const router = require('express').Router(); 
const Book = require('../models/book');
const { loginAuth, adminAuth } = require('../middleware');


router.get('/books', (req, res) => {
    Book.find({}, '-_id title numAvailable', function(err, books) {   
        if (err) throw err;
        res.send(books );
    })
})



//router.get()




module.exports = router;