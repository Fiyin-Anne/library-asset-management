const jwt = require('jsonwebtoken');

function loginAuth(req, res, next) {
    const authorizationHeaader = req.headers.authorization;
    if (authorizationHeaader) {
        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        try {
            let result = jwt.verify(
                token, 
                process.env.TOKEN_SECRET, 
                {
                    expiresIn: '1hr'
                }
            );
            req.decoded = result;
            next();
        } catch (err) {
            return res.json({err: err});
        }
    } else {
        res.status(401).json({error: `Authentication error. Token required.`});
    }
    };

function adminAuth(req, res, next) {
    const payload = req.decoded;
    console.log('Admin: ', payload.isAdmin)
    if (payload && payload.isAdmin) {
        next();
    } else {
        res.status(401).json({error: `Authentication error`});
    }
};

    module.exports = { 
        loginAuth,
        adminAuth }