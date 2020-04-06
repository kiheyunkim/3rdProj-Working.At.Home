import {Model, DataTypes} from 'sequelize';
class WhiteListModel extends Model{}

let addWhiteListModel = (sequelize) => {
    WhiteListModel.init({
        email:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false
        },
        employeenum:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{
        sequelize,
        modelName:'whiteList'
    });
}

export {addWhiteListModel}