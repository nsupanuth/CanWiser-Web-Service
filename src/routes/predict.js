const router = require('express').Router()
const sequelize = app.get('sequelize')

/* Model */
const User = sequelize.models['user']
const General = sequelize.models['general']
const Physical = sequelize.models['physical']

const PythonShell = require('python-shell')

/*
router.post('/cholan',async (req,res) =>{

    const pyshell = new PythonShell('./src/pythonsripts/predict.py')
    const { patient_no,gender,age,height,weight,phy6_2_5_vs1,phy6_2_12_vs1,phy9_3_6_vs1,
             phy2_5_vs1,phy8_1_3_vs1,phy5_5_vs1 }  = req.body

    try {
        const user = await User.findOne({
            attributes : ['id'],
            where: {
                id : patient_no   // use session to store this value in the future
            }
        }) 

        const insertGeneral = await General.Update({
            patient_no : user.id,
            gender,
            age,
            weight,
            height,
            BMI : weight/(height*height)
        })
        
        const insertPhysical = await Physical.Create({
            phy6_2_5_vs1,phy6_2_12_vs1,phy9_3_6_vs1,phy2_5_vs1,phy8_1_3_vs1,phy5_5_vs1
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
                }
            }
        ]


        const result = await User.findOne({
            include,
            patient_no : 1 , // will be replaced with session,
            attributes : {
                exclude : ['password']
            }
        })

        res.json(result)        

    } catch (error) {
        res.status(500).end()
    }
    
})
*/

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