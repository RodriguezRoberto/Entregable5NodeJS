const { DataTypes } = require( 'sequelize' );
const { db } = require( '../utils/database' )

const Repair = db.define( 'repair', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    computerNumber : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    imgPath: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = { Repair }