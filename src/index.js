const express = require('express')
const Sequelize = require('sequelize')
const path = require('path')
const { databaseOptions,rawQueryOptions } = require('./options')

var cors = require('cors')

app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//const connectionUri = 'mysql://root:supanuth@localhost/CanWiser'
const connectionUri = 'mysql://nsupanuth:supanuth@ec2-54-255-222-12.ap-southeast-1.compute.amazonaws.com/CanWiser'
const sequelize = new Sequelize(connectionUri,databaseOptions)

app.set('sequelize',sequelize)

/* import Model */
const User = require('./models/User.js')()
const General = require('./models/General.js')()
const Predictive = require('./models/Predictive.js')()
const Physical = require('./models/Physical.js')()
const Cholan = require('./models/Cholan.js')()
const Dashboard = require('./models/Dashboard')()
const DashboardStat = require('./models/DashboardStat')()

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

/* Relation between predictive and dashboardstat eg. mean median max min*/
Predictive.hasOne(DashboardStat,{
    foreignKey : 'predictive_no'    
})
DashboardStat.belongsTo(Predictive,{
    foreignKey : 'predictive_no'    
})


app.use("/public", express.static(path.resolve(__dirname, '../public')));


/**
 * For Authentication
 */
const jwtAuth = require('./middlewares/jwt-auth')

app.get('/',(req,res) => {
    res.json([])
})

app.use(require('./routes/auth'))

/* router */
app.use('/user',require('./routes/user'))
app.use('/predict',require('./routes/predict'))
app.use('/retrain',require('./routes/retrain'))
app.use('/dashboard',require('./routes/dashboard'))
app.use('/dashboard/stat',require('./routes/dashboardStat'))


const port = 3000

app.listen(port)