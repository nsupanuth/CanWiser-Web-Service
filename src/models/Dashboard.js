const Sequelize = require('sequelize')
const sequelize = app.get('sequelize')

module.exports = () => {

    const fields = {
        id : {
          type : Sequelize.INTEGER,
          primaryKey : true,
          autoIncrement : true
        },
        age_0_15_non_cholan : Sequelize.INTEGER,
        age_0_15_cholan : Sequelize.INTEGER,
        age_16_30_non_cholan : Sequelize.INTEGER,
        age_16_30_cholan : Sequelize.INTEGER,
        age_31_50_non_cholan : Sequelize.INTEGER,
        age_31_50_cholan : Sequelize.INTEGER,
        age_51_70_non_cholan : Sequelize.INTEGER,
        age_51_70_cholan : Sequelize.INTEGER,
        age_70_plus_non_cholan : Sequelize.INTEGER,
        age_70_plus_cholan : Sequelize.INTEGER,
        num_of_male : Sequelize.INTEGER,
        num_of_female : Sequelize.INTEGER,

    }

    const options = {
        underscored : true,
        created_at: {
            allowNull: false,
            type: Sequelize.DATE
        },
    }

    const Dashboard = sequelize.define('dashboard',fields, options)
    //Dashboard.sync({ force : true })
    
    return Dashboard
}