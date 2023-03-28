
const Employees = require('../Models/empSchema');
const jwt = require('jsonwebtoken');

const checkLoggedIn = async (req, res, next) => {
    if (req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];



        Employees.findOne({ token: accessToken }, async function (errs, user) {
            if (errs) {
                res.status(500).send({ message: errs });
            }
            if (user) {
                jwt.verify(accessToken, 'raghuvanshi', function (err, decoded) {
                    if (err) {
                        user.token = null;
                        user.save(function (err, user) {
                            if (err) return err;
                            (null, user);
                        })
                        return res.status(500).send({ auth: false, message: 'Token has been expired. Please login again' });
                    } else {                      
                        req.token = accessToken;
                        req.user = user;
                        res.locals.loggedInUser = user;
                        next();
                    }
                })              
            }    else {
                 res.send({ message:"User not found" })
            }
        });

    } else {
        next();
    }
};

module.exports = checkLoggedIn