import {Model, DataTypes} from 'sequelize';
import {User} from './User';

class Employee extends Model{}
let addEmplyeeModel = (sequelize) => {
    Employee.init({
        email:{
            type:DataTypes.STRING,
            primaryKey:1,
            allowNull:0
        },
        name:{
            type:DataTypes.STRING(20),
            allowNull:0
        },
        employeenum:{
            type:DataTypes.INTEGER,
            allowNull:0
        },
        grade:{
            type:DataTypes.STRING,
            allowNull:0
        },
        verified:{
            type:DataTypes.BOOLEAN,
            allowNull:0
        }
    },{
        sequelize,
        modelName:'employee'
    });

    Employee.belongsTo(User,{foreignKey:'email',targetKey:'email'});
}

export {addEmplyeeModel};