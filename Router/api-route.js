let router = require('express').Router();

// Import  controller
var empController = require('../Controllers/emp');
var leaveController = require('../Controllers/leave');


// Employee routes

router.route('/reg').post(empController.signup);

router.route('/login').post(empController.login);

router.route('/logout').post(empController.logout);

//route to get all employees details
router.get('/employees', empController.allowIfLoggedin,  empController.grantAccess('readAny', 'profile'), empController.viewAll);

// route to add leaves on all employees account
router.route('/addLeave').post(empController.allowIfLoggedin, empController.grantAccess('updateAny', 'profile'),empController.addLeave);

//route to check leaves which are pending for manager approval
router.route('/viewLeaves').get(empController.allowIfLoggedin, empController.grantAccess('readAny', 'profile'), leaveController.viewAllEmpLeaves);

//route to approve or cancel the leave
router.route('/leavesStatus').post(empController.allowIfLoggedin, empController.grantAccess('readAny', 'profile'), leaveController.approveorcancelLeaves);

//route to check my leave status
router.route('/myLeave').get(empController.allowIfLoggedin, empController.grantAccess('readOwn', 'profile'), leaveController.myLeaveStatus);


router.route('/:username').get(empController.viewOne);

//route to apply leave
router.route('/applyLeave').post(empController.allowIfLoggedin,leaveController.applyLeave);
router.route('/deleteEmp').post(empController.allowIfLoggedin, empController.grantAccess('deleteAny', 'profile'), empController.deleteEmp);
router.route('/updateOwn').patch(empController.allowIfLoggedin, empController.grantAccess('updateOwn', 'profile'), empController.updateOwn);




// Export API routes
module.exports = router;