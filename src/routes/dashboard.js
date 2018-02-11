const router = require('express').Router()
const sequelize = app.get('sequelize')

/* Model */
const Dashboard = sequelize.models['dashboard']

const PythonShell = require('python-shell')


router.get('/info',async (req,res) => {

    try {
        
        const dashboardDBResult = await Dashboard.findOne({
            order: [
                ['id', 'DESC'],
            ]        
        })

        const result = {
            age : [
                { name: '0-15', noncholan : dashboardDBResult.age_0_15_non_cholan, cholan: dashboardDBResult.age_0_15_cholan },
                { name: '16-30', noncholan: dashboardDBResult.age_16_30_non_cholan, cholan: dashboardDBResult.age_16_30_cholan },
                { name: '31-50', noncholan: dashboardDBResult.age_31_50_non_cholan, cholan: dashboardDBResult.age_31_50_cholan },
                { name: '51-70', noncholan: dashboardDBResult.age_51_70_non_cholan, cholan: dashboardDBResult.age_51_70_cholan },
                { name: '71++', noncholan: dashboardDBResult.age_70_plus_non_cholan, cholan: dashboardDBResult.age_70_plus_cholan }
            ],
            gender : [
                {name : 'Male',value : dashboardDBResult.num_of_male },
                {name : 'Female',value : dashboardDBResult.num_of_female}
            ]
        }


        return res.json(result)

    } catch (err) {
        res.status(500).end()
    }

})


var jsonResult = ''

router.post('/dataset/update',async (req,res) => {


    const pyshell = new PythonShell('./src/pythonscripts/dashboardInfo.py')
       
    //pyshell.send(JSON.stringify(fileInfo)) // send file path in the future
    pyshell.on('message',function(message){
        jsonResult = JSON.parse(message)
        //console.log(jsonResult)
    })

    console.log(jsonResult)

    pyshell.end(function (err) {
        if (err) throw err
            console.log('finished');
    });

    /*
    try {
        const dashboardDBResult = await Dashboard.create({
            age_0_15_non_cholan : jsonResult.age_0_15_non_cholan,
            age_0_15_cholan : jsonResult.age_0_15_cholan,
            age_16_30_non_cholan : jsonResult.age_16_30_non_cholan,
            age_16_30_cholan : jsonResult.age_16_30_cholan,
            age_31_50_non_cholan : jsonResult.age_31_50_non_cholan,
            age_31_50_cholan : jsonResult.age_31_50_cholan, 
            age_51_70_non_cholan : jsonResult.age_51_70_non_cholan, 
            age_51_70_cholan : jsonResult.age_51_70_cholan, 
            age_70_plus_non_cholan : jsonResult.age_70_plus_non_cholan, 
            age_70_plus_cholan : jsonResult.age_70_plus_cholan, 
            num_of_male : jsonResult.num_of_male,  
            num_of_female : jsonResult.num_of_female
        })  
  
        const result = {
            age : [
                { name: '0-15', noncholan : dashboardDBResult.age_0_15_non_cholan, cholan: dashboardDBResult.age_0_15_cholan },
                { name: '16-30', noncholan: dashboardDBResult.age_16_30_non_cholan, cholan: dashboardDBResult.age_16_30_cholan },
                { name: '31-50', noncholan: dashboardDBResult.age_31_50_non_cholan, cholan: dashboardDBResult.age_31_50_cholan },
                { name: '51-70', noncholan: dashboardDBResult.age_51_70_non_cholan, cholan: dashboardDBResult.age_51_70_cholan },
                { name: '71++', noncholan: dashboardDBResult.age_70_plus_non_cholan, cholan: dashboardDBResult.age_70_plus_cholan }
            ],
            gender : {
                male : dashboardDBResult.num_of_male,
                female : dashboardDBResult.num_of_female
            }
        }

        return res.json(result)
  
      } catch (err) {
        
        return res.status(500).end()
      }
      */
    
})

module.exports = router