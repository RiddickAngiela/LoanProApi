module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    username:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING, // This will store the file path to the image
    },
  });

  return Profile;
};
