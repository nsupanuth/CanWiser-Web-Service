const router = require('express').Router()
const sequelize = app.get('sequelize')

const PythonShell = require('python-shell')

const Predictive = sequelize.models['predictive']
const DashboardStat = sequelize.models['dashboardstat']
const Op = sequelize.Op

/* File upload */
const path = require('path')
const multer = require('multer')
const fs = require('fs')

const options = {
    dest : path.resolve(__dirname,'..','datasets')
}

const uploader = multer(options)
const photoMiddleware = uploader.single('xxx')  //name on React (HTML)


router.post('/upload/confirm',async (req,res) => {

    const { accuracy,recall,f1,model_name,model_path,stat } = req.body

    try {
        const result = await Predictive.create({ accuracy,recall,f1,model_name,model_path })
        const dashboardStat = await DashboardStat.create({
            predictive_no : result.id,
            age_mean : stat[0].age,
            age_median : stat[1].age,
            age_max : stat[2].age,
            age_min : stat[3].age,
            bmi_mean : stat[0].BMI,
            bmi_median : stat[1].BMI,
            bmi_max : stat[2].BMI,
            bmi_min : stat[3].BMI,
            gammaGT_mean : stat[0].GammaGT,
            gammaGT_median : stat[1].GammaGT,
            gammaGT_max : stat[2].GammaGT,
            gammaGT_min : stat[3].GammaGT,
            AlkPhosphatase_mean : stat[0].AlkPhosphatase,
            AlkPhosphatase_median : stat[1].AlkPhosphatase,
            AlkPhosphatase_max : stat[2].AlkPhosphatase,
            AlkPhosphatase_min : stat[3].AlkPhosphatase,
            ALT_mean : stat[0].ALT,
            ALT_median : stat[1].ALT,
            ALT_max : stat[2].ALT,
            ALT_min : stat[3].ALT,
            CEA_mean : stat[0].CEA,
            CEA_median : stat[1].CEA,
            CEA_max : stat[2].CEA,
            CEA_min : stat[3].CEA,
            CA199_mean : stat[0].CA199,
            CA199_median : stat[1].CA199,
            CA199_max : stat[2].CA199,
            CA199_min : stat[3].CA199,

        })
            
        

        return res.json({status : 'success'})
        
    } catch (err) {
        return res.status(500).end()
    }

})

router.post('/upload/cancel',(req,res) => {
    
    const { pathName } = req.body

    try {
        //fs.unlinkSync("./src/predictivemodels/dtree.pkl")
        fs.unlinkSync(pathName)
        return res.json({
            status : 'Success'
        })
    } catch (error) {
        return res.json({
            status : 'Fail'
        })
    }
    
})

router.get('/getModel',async (req,res) => {
    
    const { accuracy,recall,f1,model_name } = req.body

    try {
       const result = await Predictive.findOne({
            order : [
                [ 'created_at', 'DESC' ],
            ],
       }) 

       return res.json(result)

    } catch (error) {
        
        return res.status(500).end()
    }
})


router.post('/upload',photoMiddleware,(req,res) => {

    const { filename, originalname, destination } = req.file

    const oldpath = path.resolve(destination,filename)    
    const ext = (path.extname(originalname))
    let newpath = path.resolve(destination,originalname)

    if(ext == '.csv'){
        console.log('OK')
        newpath = path.resolve(destination,'csv',originalname)   
        fs.renameSync(oldpath,newpath)
    
        var newfilename = path.basename(newpath)
        console.log(newfilename)
     
        const pyshell = new PythonShell('./src/pythonscripts/retrainModel.py')
        var fileInfo = {
            filename : newfilename
        }
    
        var jsonResult = null
        pyshell.send(JSON.stringify(fileInfo))
        pyshell.on('message',function(message){
            jsonResult = JSON.parse(message)
            //console.log(jsonResult.stat[0])
            res.json({
                results : jsonResult,
                status : 'success'
            })
        })
    
        pyshell.end(function (err) {
            if (err) throw err
            console.log('finished');
        });
         
    }else{
        res.json({
            status : 'Failed'
        })
    }

})


router.get('/', (req,res) => {

    res.json({"Test" : "Retrain"})   
})





module.exports = router

