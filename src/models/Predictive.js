const Sequelize = require('sequelize')
const sequelize = app.get('sequelize')

module.exports = () => {

    const fields = {
        id : {
          type : Sequelize.INTEGER,
          primaryKey : true,
          autoIncrement : true
        },
        filePath : Sequelize.STRING,
        accuracy : Sequelize.DOUBLE,
        recall : Sequelize.DOUBLE,
        f1 : Sequelize.DOUBLE,
        model_name : Sequelize.STRING,
        model_path : Sequelize.STRING
    }

    const options = {
        underscored : true,
        created_at: {
            allowNull: false,
            type: Sequelize.DATE
        },
    }

    const Predictive = sequelize.define('predictive',fields, options)
    //Predictive.sync({ force : true })
    
    return Predictive
}