const router = require('express').Router()
const sequelize = app.get('sequelize')

const PythonShell = require('python-shell')

const Predictive = sequelize.models['predictive']
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

    const { accuracy,recall,f1,model_name,model_path } = req.body

    try {
        //console.log("Test /upload/confirm")
        const result = await Predictive.create({ accuracy,recall,f1,model_name,model_path })
        return res.json(result)
        
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

        //    const insertResult = await Predictive.create({
        //          accuracy,
        //          recall,
        //          f1,
        //          model_name,
        //          model_path : result.model_path
        //    })

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

