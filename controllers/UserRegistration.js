

const { DataTypes } = require('sequelize');
const { sequelize } = require('../model/model'); // Adjust the path as needed

const UserRegistration = sequelize.define('UserRegistration', {
    NOM: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PRENOM: {
      type: DataTypes.STRING,
      allowNull: false
    },
    EMAIL: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PASSWORD: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ROLE: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      allowNull: false
    },
    ISVALIDATED: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    TOKEN:{
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true
  });
  

async function syncModel() {
    try {
      
     await UserRegistration.sync({ alter: true });
    } catch (error) {
      console.error('Error syncing models:', error);
    }
  }
  
  sequelize.sync()
    .then(() => {
      // console.log('Database & tables synced');
    })
    .catch(err => {
      // console.error('Error syncing database:', err);
    });
  

  syncModel();


module.exports = UserRegistration
  

