function admin(req,res,next){
    if(req.user.role !== "admin"){
        return res.status(403).send("Access Denied");
    }

    else {
        next();
    }
}

function user(req,res,next){
    if(req.user.role !== "user"){
        return res.status(403).send("Access Denied");
    }

    else {
        next();
    }
}
function producer(req,res,next){
    if(req.user.role !== "producer"){
        return res.status(403).send("Access Denied");
    }

    else {
        next();
    }
}
function adminOrproducer(req,res,next){
    if(req.user.role === "producer" || req.user.role === "admin"){
        next();
    } 
    else {
        return res.status(403).send("Access Denied");
    }
}

function adminOrUser(req,res,next){
    if(req.user.role === "user" || req.user.role === "admin"){
        next();
    } 
    else {
        return res.status(403).send("Access Denied");
    }
}

module.exports.producer = producer;
module.exports.admin = admin;
module.exports.user = user;
module.exports.adminOrUser = adminOrUser;
module.exports.adminOrproducer = adminOrproducer;