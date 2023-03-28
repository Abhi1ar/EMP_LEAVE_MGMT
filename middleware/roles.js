const AccessControl = require("accesscontrol");
const ac = new AccessControl();



exports.roles = (()=> {
    ac.grant("emp")
        .readOwn("profile")
        .updateOwn("profile")
       
    ac.grant("manager")
        .extend("emp")
        .readAny("profile")
        .updateAny("profile")
        .deleteAny("profile");
       


    return ac;
})();