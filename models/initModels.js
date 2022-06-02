const { User } = require('./user.model');
const { Repair } = require('./repair.model');

const initModels = () => {
    // One to many relation
    User.hasMany(Repair);
    Repair.belongsTo(User);
};

module.exports = { initModels };