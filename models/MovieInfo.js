import {Model, DataTypes} from 'sequelize';
import {User} from './User';
class MovieInfo extends Model{}

let addMovieInfoModel = (sequelize) => {
    MovieInfo.init({
        email:{
            type:DataTypes.STRING,
            allowNull:0
        },
        filename:{
            type:DataTypes.STRING(64),
            allowNull:0
        },
        path:{
            type:DataTypes.STRING,
            allowNull:0
        },
        date:{
            type:DataTypes.DATEONLY,
            allowNull:0
        },
        title:{
            type:DataTypes.STRING,
            allowNull:0
        },
        description:{
            type:DataTypes.STRING,
            allowNull:0
        }
    },{
        sequelize,
        modelName:'video'
    });

    MovieInfo.belongsTo(User,{foreignKey:'email',targetKey:'email'});
}
export {addMovieInfoModel}