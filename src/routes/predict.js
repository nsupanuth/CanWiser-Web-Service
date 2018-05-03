const router = require('express').Router()
const sequelize = app.get('sequelize')

/* Model */
const User = sequelize.models['user']
const General = sequelize.models['general']
const Physical = sequelize.models['physical']

const Predictive = sequelize.models['predictive']
const DashboardStat = sequelize.models['dashboardstat']

const PythonShell = require('python-shell')


router.get('/info', async (req,res) => {

    try {
        const include = [
            {
                model : DashboardStat,
                attributes : {
                    exclude : ['id','predictive_no']
                }
            }
        ]

        const result = await Predictive.findOne({
            include,
            order: [
                ['id', 'DESC'],
            ]    
        })


        
    
        return res.json(result)

    } catch (error) {
        
        res.status(500).end()

    }
    

})


router.post('/test',async (req,res) => {

    const { patient_no,phy6_2_5_vs1,phy6_2_12_vs1,phy9_3_6_vs1 ,phy2_5_vs1 ,phy8_1_3_vs1,phy5_5_vs1 } = req.body

    try {
        const result = await Physical.create({
            patient_no,phy6_2_5_vs1,phy6_2_12_vs1,phy9_3_6_vs1 ,phy2_5_vs1 ,phy8_1_3_vs1,phy5_5_vs1
        })  
  
        return res.json(result)
  
      } catch (err) {
        
        return res.status(500).end()
      }

})


router.post('/test/clustering',async (req,res) => {

    const pyshell = new PythonShell('./src/pythonscripts/clustering.py')

    const { gender,age,weight,height,phy6_2_5_vs1,phy6_2_12_vs1,phy9_3_6_vs1,phy2_5_vs1,phy8_1_3_vs1,
             phy5_5_vs1 }  = req.body 
    
    const BMI = weight/((height/100)*(height/100))
    console.log("BMI = "+BMI)

    const predictData = {
                            gender,
                            age,
                            BMI,
                            phy6_2_5_vs1,
                            phy6_2_12_vs1,
                            phy9_3_6_vs1,
                            phy2_5_vs1,
                            phy8_1_3_vs1,
                            phy5_5_vs1
                        }   
    
    console.log(predictData)

    var jsonResult = null
    var status = null
    pyshell.send(JSON.stringify(predictData))
    console.log("Test Clustering")
    pyshell.on('message',function(message){
        console.log(message)
        jsonResult = JSON.parse(message)
        res.json({
            results : jsonResult,
            status : 'success'
        })
    })

    pyshell.end(function (err) {
        if (err) throw err
        console.log('finished');
    });

})



router.post('/test/cholan',async (req,res) => {

    const pyshell = new PythonShell('./src/pythonscripts/predictCholan.py')

    const { patient_no,gender,age,height,weight,phy6_2_5_vs1,phy6_2_12_vs1,phy9_3_6_vs1,
            phy2_5_vs1,phy8_1_3_vs1,phy5_5_vs1,gammaGT,alkPhosphatase,ALT,CEA,
            CA199  }  = req.body 

    var predictData = { gammaGT, alkPhosphatase,ALT,CEA,CA199 }

    var jsonResult = null
    var status = null
    pyshell.send(JSON.stringify(predictData))
    pyshell.on('message',function(message){
        console.log(message)
        jsonResult = JSON.parse(message)

        res.json({
            results : jsonResult,
            status : 'success'
        })
    
    })

    pyshell.end(function (err) {
        if (err) throw err
        console.log('finished');
    });


})



router.post('/cholan',async (req,res) =>{

    // const pyshell = new PythonShell('./src/pythonsripts/predict.py')
    // const { patient_no,gender,age,height,weight,phy6_2_5_vs1,phy6_2_12_vs1,phy9_3_6_vs1,
    //          phy2_5_vs1,phy8_1_3_vs1,phy5_5_vs1,gammaGT,alkPhosphatase,ALT,CEA,
    //          CA199  }  = req.body

    const { patient_no,gender,age,height,weight,phy6_2_5_vs1,phy6_2_12_vs1,phy9_3_6_vs1,
            phy2_5_vs1,phy8_1_3_vs1,phy5_5_vs1,gammaGT,alkPhosphatase }  = req.body

    try {
       
        const general = await General.findById(patient_no)

        console.log(general.id)

        /* Update general */
        general.gender = gender
        general.age = age
        general.height = height
        general.weight = weight
        general.BMI = weight / ((height/100) * (height/100))

        await general.save()

        const insertPhysical = await Physical.create({
            patient_no : patient_no, // will be replaced with session,
            phy6_2_5_vs1,
            phy6_2_12_vs1,
            phy9_3_6_vs1,
            phy2_5_vs1,
            phy8_1_3_vs1,
            phy5_5_vs1
        })
        
        const include = [
            {
                model : General,
                attributes : {
                    exclude : ['id','patient_no']
                }
            },
            {
                model : Physical,
                attributes : {
                    exclude : ['patient_no']
                },
                order : [
                    [Physical,'id','DESC']
                ]
            }
        ]

        /* predict cholan */
        //executePythonModel(insertPhysical)

        const result = await User.findOne({
            include,
            patient_no : patient_no , // will be replaced with session
            attributes : {
                exclude : ['password']
            }
        })

        res.json(result)    
        
    } catch (error) {
        res.status(500).end()
    }
    
})

function executePythonModel(data){
    
    const pyshell = new PythonShell('./src/pythonscripts/predictCholan.py')
    


}


router.post('/user',(req,res) => {

    const pyshell = new PythonShell('./src/pythonscripts/predict.py')
    var predictData = {
        gammaGT : 107.0,
        alkPhosphatase : 137.0,
        ALT : 29.0,
        CEA : 2.16,
        CA199 : 553.20
    }

    //pyshell.send(JSON.stringify([21.46,94.25,0.09444,0.09947,0.2075]));
    pyshell.send(JSON.stringify(predictData))
    pyshell.on('message',function(message){
        console.log(message)
        var status = 'fail'
        if(message == 1){
            status = 'success'
        }
        const results = {
            'result' : message,
            'status' : status
        }
        res.send(results)
    })

    pyshell.end(function (err) {
        if (err) throw err
        console.log('finished');
    });

})



module.exports = router