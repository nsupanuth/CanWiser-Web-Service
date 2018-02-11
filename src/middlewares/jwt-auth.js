const jwt = require('jsonwebtoken')

module.exports = (req,res,next) => {
    const authHeader = req.headers['authorization']

    if(!authHeader){
        return res.status(401).end()
    }else{
        const token = authHeader.replace('Bearer ','')

        try{
            const decoded = jwt.verify(token,'SUPERSECRET')

            console.log(decoded)

            next()
        } catch(err){
            return res.status(403).end()
        }
    }
}
 