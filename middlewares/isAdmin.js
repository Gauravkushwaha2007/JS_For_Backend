
const isAdmin =  (req, res, next) =>{

    if(!req.user){
        return res.status(401).redirect('/users/login');
    }

    if(req.user && req.user.role === 'admin'){
        next()
    }
    else{
        return res.status(403).send('Access: denied "ONLY ADMIN CAN ADD/DELETE/EDIT" ')
    }
}


module.exports = isAdmin;