import {Model, DataTypes} from 'sequelize';
class User extends Model{}

let addUserModel = (sequelize) => {
    User.init({
        email:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false
        },
        accountType:{
            type:DataTypes.STRING(20),
            allowNull:false
        },
        passwd:{
            type:DataTypes.STRING(64),
            allowNull:false
        },
        salt:{
            type:DataTypes.STRING(64),
            allowNull:false
        },
        verification:{
            type:DataTypes.STRING(8),
            allowNull:false
        },
        lastchange:{
            type:DataTypes.DATE(),
            allowNull:false
        },
        needChange:{
            type:DataTypes.BOOLEAN,
            allowNull:false
        }
    },{
        sequelize,
        modelName:'user'
    });
}

export { User, addUserModel}