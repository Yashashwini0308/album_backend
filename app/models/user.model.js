module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
     type: Sequelize.STRING 
    },
    lastName: {
      type: Sequelize.STRING
    },
    phoneNo:{
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    resetPasswordToken:{
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  },{
    updatedAt: false
  })
  return User;
};
