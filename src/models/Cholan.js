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
        Cholan : Sequelize.DOUBLE,
        Proba : Sequelize.DOUBLE 
    }

    const options = {
        underscored : true,
        created_at: {
            allowNull: false,
            type: Sequelize.DATE
        },
    }

    const Cholan = sequelize.define('cholan',fields, options)
    //Cholan.sync({ force : true })
    
    return Cholan
}