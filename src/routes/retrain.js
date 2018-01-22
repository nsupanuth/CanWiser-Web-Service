const router = require('express').Router()
const sequelize = app.get('sequelize')

const PythonShell = require('python-shell')

/* File upload */
const path = require('path')
const multer = require('multer')
const fs = require('fs')

const options = {
    dest : path.resolve(__dirname,'..','datasets')
}

const uploader = multer(options)
const photoMiddleware = uploader.single('xxx')  //name on React (HTML)


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
     
        // res.json({
        //     status : 'success',
        //     filename : newfilename
        // })
    
        const pyshell = new PythonShell('./src/pythonscripts/retrainModel.py')
        var fileInfo = {
            filename : newfilename
        }
    
        pyshell.send(JSON.stringify(fileInfo))
        pyshell.on('message',function(message){
            console.log(message)
            res.json({
                features : message,
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

