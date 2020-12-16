function admin(req,res,next){
    if(req.loggedClient.role !== "admin"){
        return res.status(403).send("Access Denied");
    }

    else {
        next();
    }
}

function user(req,res,next){
    console.log(req.loggedClient.role);
    if(req.loggedClient.role !== "user"){
        return res.status(403).send("Access Denied");
    }

    else {
        next();
    }
}

function agent(req,res,next){
    if(req.loggedClient.role !== "agent"){
        return res.status(403).send("Access Denied");
    }

    else {
        next();
    }
}

function adminOrUser(req,res,next){
    if(req.loggedClient.role === "user" || req.loggedClient.role === "admin"){
        next();
    } 
    else {
        return res.status(403).send("Access Denied");
    }
}

function agentOrUser(req,res,next){
    console.log(req.loggedClient.role);
    if(req.loggedClient.role === "user" || req.loggedClient.role === "agent"){
        next();
    } 
    else {
        return res.status(403).send("Access Denied");
    }
}
function agentAdminOrUser(req,res,next){
    if(req.loggedClient.role === "user" || req.loggedClient.role === "agent" || req.loggedClient.role === "admin"){
        next();
    } 
    else {
        return res.status(403).send("Access Denied");
    }
}

module.exports.admin = admin;
module.exports.user = user;
module.exports.agent = user;
module.exports.adminOrUser = adminOrUser;
module.exports.agentOrUser = agentOrUser;
module.exports.agentAdminOrUser = agentAdminOrUser;
