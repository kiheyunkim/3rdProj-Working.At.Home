import Sequelize from 'sequelize';
import {addUserModel} from './User';
import {addEmplyeeModel} from './Employee';
import {addMovieInfoModel} from './MovieInfo';
import {addWhiteListModel} from './WhiteLIst';
import {addAvatarInfoModel} from './LocalAvatar';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize = null;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
}else{
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

addUserModel(sequelize);
addEmplyeeModel(sequelize);
addMovieInfoModel(sequelize);
addWhiteListModel(sequelize);
addAvatarInfoModel(sequelize);

export default sequelize;