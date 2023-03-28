Employees = require('../Models/empSchema');
Leaves = require('../Models/leaveSchema');


// Handle emp apply leave actions
exports.applyLeave = (req, res) => {

    let userid= req.user._id;
    let el = req.body.EL;
    let cl = req.body.CL;
    let sl = req.body.SL;
    console.log(el, cl, sl);
    
   
    Employees.findOne({ _id: userid }, function (err, emp) {
        if (emp) {
            if (typeof req.body.EL == 'undefined' && typeof req.body.CL == 'undefined') {
               
                if (sl <= 2) {
                    if (sl <= emp.SL) {
                        const leave = new Leaves({
                            username: emp.username,
                            empid: userid,
                            SL: req.body.SL
                        });
                        emp.SL -= sl;
                        emp.save();
                        leave.save().then((empleavedata) => {
                            return res.status(200).send({ message: 'Your Leave has been applied and send to your manager for approval', data: empleavedata });
                        })
                    } else {
                        return res.status(200).send({
                            message: 'Your can not apply leave as you do not have enough leave balance',
                            sick_leave: emp.SL });
                    }
                   
                } else {
                    return res.status(200).send({
                        message: 'Your can not apply sick leave more than 2 days'
                       
                    });

                }
            } else if (typeof req.body.CL == 'undefined' && typeof req.body.SL == 'undefined') {
                if (el <= emp.EL) {
                    const leave = new Leaves({
                        username: emp.username,
                        empid: userid,
                        EL: req.body.EL
                    });
                    emp.EL -= el;
                    emp.save();
                    leave.save().then((empleavedata) => {
                        return res.status(200).send({ message: 'Your Leave has been applied and send to your manager for approval', data: empleavedata });
                    })
                } else {
                    return res.status(200).send({
                        message: 'Your can not apply leave as you do not have enough leave balance',                       
                        earned_leave: emp.EL
                       
                    });

                }
            } else if (typeof req.body.EL == 'undefined' && typeof req.body.SL == 'undefined') {
                if (cl <= emp.CL) {
                    const leave = new Leaves({
                        username: emp.username,
                        empid: userid,
                        CL: req.body.CL
                    });
                    emp.CL -= cl;
                    emp.save();
                    leave.save().then((empleavedata) => {
                        return res.status(200).send({ message: 'Your Leave has been applied and send to your manager for approval', data: empleavedata });
                    })
                } else {
                    return res.status(200).send({
                        message: 'Your can not apply leave as you do not have enough leave balance',
                        casual_leave: emp.CL

                    });

                }
            }

            }
           
        
           if(err) {
               return  res.status(500).send("There was a problem while applying leave.");
            }       
    })            
};




exports.viewAllEmpLeaves = async (req, res, next) => {
    const empLeave = await Leaves.find({});
    return res.status(200).json({
        message: "Leaves are sent to you for approval",
        data: empLeave
    });
};


exports.myLeaveStatus = (req, res) => {
    console.log(req.user);
    Leaves.find({ username: req.user.username }).then(empleavedata => {
        if (empleavedata!=0) {
            res.json({
                message: "Your Leave record",
                data: empleavedata
            });           
        }
       
        res.json({
            message: "No Leave found for this employee",

        });
    })
};

exports.approveorcancelLeaves = (req, res) => {
    Leaves.findOne({ _id: req.body.leave_id }).then(emp => {
        let username = req.body.username;
        console.log(username);
            let leave_id = req.body.leave_id;
            let empid = req.body.empid;
        let status = req.body.status;
        
        if (emp.status == 'Pending for Approval') {
            if (status == "approve") {
                emp.status = "approve";
                emp.save().then((empleavedata) => {
                    return res.status(200).send({ message: ' Leave has been approved', data: empleavedata });
                })
            } else if (status == "reject") {
                emp.status = "reject";
                casual = emp.CL;
                sick = emp.SL;
                earned = emp.EL;
                Employees.findOne({ username: username }).then(empdata => {
                    empdata.CL += casual;
                    empdata.SL += sick;
                    empdata.EL += earned;
                    empdata.save();
                })
                emp.save().then((empleavedata) => {
                    return res.status(200).send({ message: 'Your Leave has been rejected', data: empleavedata });
                })
            }
        }else if (emp.status == 'approve') {
                return res.status(200).send({ message: 'You already approved this Leave' });
            } else {
                return res.status(200).send({ message: 'You already rejected this Leave' });
            }
                     
    })
};

