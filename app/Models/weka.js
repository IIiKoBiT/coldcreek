module.exports = function (sequelize,Sequelize){
    let options = {
        timestamps: false,
        freezeTableName: true
    };

    return sequelize.define('data_weka_take_aggregate',{
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        value: {
            type: Sequelize.DECIMAL
        },
        date: {
            type: Sequelize.DATE
        }

    },options);

};