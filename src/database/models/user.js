const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    displayName: DataTypes.STRING,
    image: DataTypes.STRING
  },
  {
    tableName: 'Users',
    timestamps: false
  });

  User.associate = (db) => {
    User.hasMany(db.BlogPost, { as: 'BlogPosts', foreignKey: 'id' });
  };

  return User;
};