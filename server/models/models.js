const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const User = sequelize.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    firstName: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING, defaultValue: "ACTIVE"},
    role: {type: DataTypes.STRING, defaultValue: "ADMIN"},
    lastLoginDate: {type: DataTypes.DATE}
})

module.exports = {
    User
}