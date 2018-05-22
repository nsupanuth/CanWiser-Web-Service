const Sequelize = require('sequelize')
const sequelize = app.get('sequelize')

module.exports = () => {

    const fields = {
        id : {
          type : Sequelize.INTEGER,
          primaryKey : true,
          autoIncrement : true
        },
        username :  Sequelize.STRING,
        password :  Sequelize.STRING,
        first_name :  Sequelize.STRING,
        last_name :  Sequelize.STRING,
        gender : Sequelize.BOOLEAN,
        role : Sequelize.STRING,
        picture : Sequelize.STRING
    }

    const options = {
        timestamps : false,
        underscored : true
    }

    const User = sequelize.define('user',fields, options)
    //User.sync({ force : true })
    
    return User
}