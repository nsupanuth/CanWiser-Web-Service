const Sequelize = require('sequelize')
const sequelize = app.get('sequelize')

module.exports = () => {

    const fields = {
        id : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        predictive_no : {
            type : Sequelize.INTEGER,
            foreignKey : true
        },
        age_mean : Sequelize.DOUBLE,
        age_median : Sequelize.DOUBLE,
        age_max : Sequelize.DOUBLE,
        age_min : Sequelize.DOUBLE,
        bmi_mean : Sequelize.DOUBLE,
        bmi_median : Sequelize.DOUBLE,
        bmi_max : Sequelize.DOUBLE,
        bmi_min : Sequelize.DOUBLE,
        gammaGT_mean : Sequelize.DOUBLE,
        gammaGT_median : Sequelize.DOUBLE,
        gammaGT_max : Sequelize.DOUBLE,
        gammaGT_min : Sequelize.DOUBLE,
        AlkPhosphatase_mean : Sequelize.DOUBLE,
        AlkPhosphatase_median : Sequelize.DOUBLE,
        AlkPhosphatase_max : Sequelize.DOUBLE,
        AlkPhosphatase_min : Sequelize.DOUBLE,
        ALT_mean : Sequelize.DOUBLE,
        ALT_median : Sequelize.DOUBLE,
        ALT_max : Sequelize.DOUBLE,
        ALT_min : Sequelize.DOUBLE,
        CEA_mean : Sequelize.DOUBLE,
        CEA_median : Sequelize.DOUBLE,
        CEA_max : Sequelize.DOUBLE,
        CEA_min : Sequelize.DOUBLE,
        CA199_mean : Sequelize.DOUBLE,
        CA199_median : Sequelize.DOUBLE,
        CA199_max : Sequelize.DOUBLE,
        CA199_min : Sequelize.DOUBLE,

    }

    const options = {
        underscored : true,
        created_at: {
            allowNull: false,
            type: Sequelize.DATE
        },
    }

    const DashboardStat = sequelize.define('dashboardstat',fields, options)
    //DashboardStat.sync({ force : true })
    
    return DashboardStat
}