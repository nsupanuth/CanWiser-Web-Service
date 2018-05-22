const router = require('express').Router()
const jwt = require('jsonwebtoken')

const secret = 'SUPERSECRET'
const sequelize = app.get('sequelize')
const User = sequelize.models['user']

router.post('/login',async (req,res) => {

   const credentials = req.body
   
   const user = await User.findOne({
       where : {
           username : credentials.username,
           password : credentials.password
       }
   })

   if(!user){
       return res.status(401).end()
   } else {
        const payload = {
            username : credentials.username
        }

        const token = jwt.sign(payload,secret)

        const result = {
            token : token,
            username : user.username,
            role : user.role,
            picture : user.picture
        }

        // return res.json({token : token})    
        return res.json(result)
   }

})

module.exports = router