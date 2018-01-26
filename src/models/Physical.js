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
        phy6_2_5_vs1 : Sequelize.DOUBLE,
        phy6_2_12_vs1 : Sequelize.DOUBLE,
        phy9_3_6_vs1 : Sequelize.DOUBLE,
        phy2_5_vs1 : Sequelize.DOUBLE,
        phy8_1_3_vs1 : Sequelize.DOUBLE,
        phy5_5_vs1 : Sequelize.DOUBLE
    }

    const options = {
        timestamps : false,
        underscored : true,
        created_at: {
            allowNull: false,
            type: Sequelize.DATE
        },
    }

    const Physical = sequelize.define('physical',fields, options)
    //Physical.sync({ force : true })
    
    return Physical
}