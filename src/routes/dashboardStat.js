const router = require('express').Router()
const sequelize = app.get('sequelize')

/* Model */
const DashboardStat = sequelize.models['dashboardstat']

const PythonShell = require('python-shell')


router.get('/',async (req,res) => {

    try {
        const Dashboardstat = await DashboardStat.findOne({
            order: [
                ['id', 'DESC'],
            ]        
        })

        const result = [
            {
                stat : "mean",
                age : Dashboardstat.age_mean.toFixed(2),
                BMI : Dashboardstat.bmi_mean.toFixed(2),
                GammaGT : Dashboardstat.gammaGT_mean.toFixed(2) ,
                AlkPhosphatase : Dashboardstat.AlkPhosphatase_mean.toFixed(2),
                ALT : Dashboardstat.ALT_mean.toFixed(2),
                CEA : Dashboardstat.CEA_mean.toFixed(2),
                CA199 : Dashboardstat.CA199_mean.toFixed(2)
              },
              {
                stat : "median",
                age : Dashboardstat.age_median,
                BMI : Dashboardstat.bmi_median,
                GammaGT : Dashboardstat.gammaGT_median ,
                AlkPhosphatase : Dashboardstat.AlkPhosphatase_median,
                ALT : Dashboardstat.ALT_median,
                CEA : Dashboardstat.CEA_median,
                CA199 : Dashboardstat.CA199_median
              },
              {
                stat : "max",
                age : Dashboardstat.age_max,
                BMI : Dashboardstat.bmi_max,
                GammaGT : Dashboardstat.gammaGT_max ,
                AlkPhosphatase : Dashboardstat.AlkPhosphatase_max,
                ALT : Dashboardstat.ALT_max,
                CEA : Dashboardstat.CEA_max,
                CA199 : Dashboardstat.CA199_max
              },
              {
                stat : "min",
                age : Dashboardstat.age_min,
                BMI : Dashboardstat.bmi_min,
                GammaGT : Dashboardstat.gammaGT_min ,
                AlkPhosphatase : Dashboardstat.AlkPhosphatase_min,
                ALT : Dashboardstat.ALT_min,
                CEA : Dashboardstat.CEA_min,
                CA199 : Dashboardstat.CA199_min
              }
        ]


        return res.json(result)

    } catch (err) {
        res.status(500).end()
    }

})


module.exports = router