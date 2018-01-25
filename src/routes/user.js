const router = require('express').Router()
const sequelize = app.get('sequelize')

/* Model */
const User = sequelize.models['user']
const General = sequelize.models['general']

const Op = sequelize.Op

router.get('/general',async (req,res) => {

    try {
        const result = await General.findAll({
            limit : 5
        })

        return res.json(result)
    } catch (error) {
        return res.status(500).end()        
        
    }
})


router.get('/info',async (req,res) => {

    console.log("Info......")    

    const include = [
        {
            model : General,
            attributes : {
                exclude : ['id','patient_no']
            }
        }
    ]

    try {
      console.log("Info1")            
      const result = await User.findAll({
        include,
        attributes : {
            exclude : ['password']
        }
      })

      console.log("Info2")            
      
      return res.json(result)      

    } catch (error) {
    return res.status(500).end()        
    }

})

router.post('/register',async (req,res) => {

    const { username,password,first_name,last_name,gender } = req.body

    try {
      const result = await User.create({username,password,first_name,last_name,gender})  

      return res.json(result)

    } catch (err) {
        return res.status(500).end()
    }

})

module.exports = router

