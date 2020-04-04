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
            allowNull:true
        },
        salt:{
            type:DataTypes.STRING(64),
            allowNull:true
        },
        lastchange:{
            type:DataTypes.DATE(),
            allowNull:true
        },
        needChange:{
            type:DataTypes.BOOLEAN,
            allowNull:true
        }
    },{
        sequelize,
        modelName:'user'
    });
}

export { User, addUserModel}