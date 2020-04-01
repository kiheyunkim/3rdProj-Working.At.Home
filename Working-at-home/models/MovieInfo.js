import {Model, DataTypes} from 'sequelize';
import {User} from './User';
class MovieInfo extends Model{}

let addMovieInfoModel = (sequelize) => {
    MovieInfo.init({
        email:{
            type:DataTypes.STRING,
            primaryKey:1,
            allowNull:0
        },
        path:{
            type:DataTypes.STRING,
            allowNull:0
        },
        dateStart:{
            type:DataTypes.DATE,
            allowNull:0
        },
        dateEnd:{
            type:DataTypes.DATE,
            allowNull:0
        },
        evaluation:{
            type:DataTypes.STRING,
            allowNull:1
        }
    },{
        sequelize,
        modelName:'movieinfo'
    });

    MovieInfo.belongsTo(User,{foreignKey:'email',targetKey:'email'});
}
export {addMovieInfoModel}