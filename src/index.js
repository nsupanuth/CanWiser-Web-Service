const express = require('express')
const Sequelize = require('sequelize')
const { databaseOptions,rawQueryOptions } = require('./options')

app = express()
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//const connectionUri = 'mysql://root:supanuth@localhost/CanWiser'
const connectionUri = 'mysql://nsupanuth:supanuth@ec2-54-169-53-185.ap-southeast-1.compute.amazonaws.com/CanWiser'
const sequelize = new Sequelize(connectionUri,databaseOptions)

app.set('sequelize',sequelize)

/* import Model */
const User = require('./models/User.js')()
const General = require('./models/General.js')()
const Predictive = require('./models/Predictive.js')()
const Physical = require('./models/Physical.js')()
const Cholan = require('./models/Cholan.js')()

/* Relation between user and general */
User.hasOne(General,{
    foreignKey : 'patient_no'        
})
General.belongsTo(User,{
    foreignKey : 'patient_no'    
})

/* Relation between user and physical */
User.hasMany(Physical,{
    foreignKey : 'patient_no'    
})
Physical.belongsTo(User,{
    foreignKey : 'patient_no'    
})

/* Relation between user and cholan */
User.hasMany(Cholan,{
    foreignKey : 'patient_no'    
})
Cholan.belongsTo(User,{
    foreignKey : 'patient_no'    
})



app.get('/',(req,res) => {
    res.json({})
})

/* router */
app.use('/user',require('./routes/user'))
app.use('/predict',require('./routes/predict'))
app.use('/retrain',require('./routes/retrain'))

const port = 3000

app.listen(port)