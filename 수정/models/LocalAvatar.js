import {Model, DataTypes} from 'sequelize';
import {User} from './User';
class LocalAvatar extends Model{}

let addAvatarInfoModel = (sequelize) => {
    LocalAvatar.init({
        email:{
            type:DataTypes.STRING,
            allowNull:0
        },
        filename:{
            type:DataTypes.STRING(64),
            allowNull:1
        },
        path:{
            type:DataTypes.STRING,
            allowNull:1
        }
    },{
        sequelize,
        modelName:'localAvatar'
    });

    LocalAvatar.belongsTo(User,{foreignKey:'email',targetKey:'email'});
}
export {addAvatarInfoModel}