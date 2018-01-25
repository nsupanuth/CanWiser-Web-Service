const router = require('express').Router()
const sequelize = app.get('sequelize')

const PythonShell = require('python-shell')


// router.post('/cholan',(req,res) =>{

//     const pyshell = new PythonShell('./src/pythonsripts/predict.py')
//     const {  } = req.body



// })

router.post('/user',(req,res) => {

    const pyshell = new PythonShell('./src/pythonscripts/predict.py')
    var predictData = {
        one : 21.46,
        two : 94.25,
        three : 0.09444,
        four : 09947,
        five : 0.2075
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