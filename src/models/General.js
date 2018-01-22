const Sequelize = require('sequelize')
const sequelize = app.get('sequelize')

module.exports = () => {

    const fields = {
        id : {
          type : Sequelize.INTEGER,
          primaryKey : true,
          autoIncrement : true
        },
        patient_no : {
           type : Sequelize.INTEGER,
           foreignKey : true
        },
        age : Sequelize.DOUBLE,
        weight : Sequelize.DOUBLE,
        height : Sequelize.DOUBLE,
        BMI : Sequelize.DOUBLE
    }

    const options = {
        timestamps : false,
        underscored : true
    }

    const General = sequelize.define('general',fields, options)
    //General.sync({ force : true })
    
    return General
}