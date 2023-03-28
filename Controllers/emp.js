Employees = require('../Models/empSchema');
const { roles } = require('../middleware/roles');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Handle emp registration actions
exports.signup = (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password, 8);
    let username= req.body.username;
    Employees.findOne({ username: username }, (err, user) =>{
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (user) {
            return res.status(400).send({ message: 'already registered' });
        } else {
           
            const emp = new Employees({
                
                username: username,
                password: hashedPassword,
                location: req.body.location,
                role: req.body.role,
                EL: req.body.EL,
                CL: req.body.CL,
                SL: req.body.SL
            });
            emp.save().then((empdata) => {
                 res.status(200).send({ message: 'Emp registered Successfully', data: empdata });
            })      
        }
    }); 
};



async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

var generateToken = (user) => jwt.sign({ id: user._id }, 'raghuvanshi', { expiresIn: 86400 });

//Handle login action
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await Employees.findOne({ username });
        if (!user) res.json({ message: 'User not found please register yourself' });
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) res.json({ message: 'Username or Password is incorrect' });

        let presentToken = user.token;
        
        console.log("token",presentToken)
        if(validPassword){
            if (presentToken != null) {
                jwt.verify(presentToken, 'raghuvanshi', function (err, decoded) {
                    if (err) {
                        user.token = null;
                        user.save(function (err, user) {
                            if (err) return err;
                            (null, user);
                        })
                        return res.json({ auth: false, message: 'Token has been expired. Please login again' });
                    } else {
                        return res.json({
                            error: true,
                            message: "You are already logged in"
                        })
                    }
                })
    
            } else {
                let accessToken = await generateToken(user);
                user.token = accessToken;
                await user.save().then((empdata) => {
                    res.json({
                        isAuth: true,
                        message: "Login Successful",
                        data: empdata
                    });
                })
            }
        }
       

      
    } catch (error) {
        next(error);
    }
}

exports.logout= (req, res) =>{
    let username = req.body.username;
    Employees.findOne({ username: username }, async function (err, user) {
        if (err) {
            //handle error here
          return   res.json({ message: "err" });
        }
        if (user) {
            console.log(user.username);

            user.token = null;
            await user.save(function (err, user) {
                if (err) return err;
                (null, user);
            })
            return res.json({ message: 'Logged out successfully' });
        }

    })

};


// // Handle view contact info for all emp
exports.viewAll = async (req, res, next) => {
    const emps = await Employees.find({});
    res.status(200).json({
        message: "Employees retrieved successfully",
        data: emps
    });
};



// Handle add leave action for all emp
exports.addLeave = (req, res) => {
    let cl = req.body.CL;
    let sl = req.body.SL;
    let el = req.body.EL;
    Employees.find((err, data) => {
        for (let x in data) {
            data[x].CL += cl;
            data[x].SL += sl;
            data[x].EL += el;
            data[x].save();
        }    

        return res.status(200).send({
            message: "Leaves are added Successfully",
            data: data
        })
    })
};

// Handle view contact info for one emp
exports.viewOne = (req, res) => {
    Employees.findOne({ username: req.params.username }).then(emp => {
        res.json({
            message: 'Employee details loading..',
            data: emp
        });
    })
};



exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
           
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                     error: "You don't have enough permission to perform this action",
                     role: req.user.role,
                     empName: req.user.username
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

exports.allowIfLoggedin = async (req, res, next) => {
    try {
       
        const user = res.locals.loggedInUser;       
        if (!user)
             res.status(401).json({
                error: "You need to be logged in to access this route"
            });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

// Handle update contact info

exports.updateOwn = (req, res) => {
     location = req.body.location;
    console.log(location);
    console.log(req.user._id);
    Employees.findByIdAndUpdate(req.user._id, { $set: { location: location } },{ new: true }, function(err, emp) {
        if (err) {
            
           return  res.send(err);
        }
        else {

            return res.json({        
                status: "success",
                message: 'employee details updated',
                data: emp
            })
        }
          
       
    })
};
// Handle delete employee
exports.deleteEmp =  (req, res) =>{
    empid = req.body._id;
    Employees.remove({
        _id: empid
    }, function (err, emp) {
        if (err)
            return res.send(err);
             res.json({
            status: "success",
            message: 'employee deleted'
        });
    })
};
