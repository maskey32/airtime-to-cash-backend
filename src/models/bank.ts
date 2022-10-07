import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

interface BankAttributes {
    id: string;
    accountName: string;
    bankName: string;
    accountNumber: string;
    userId: string;
    bankCode: string;
}

export class BankInstance extends Model<BankAttributes> {}

BankInstance.init(
    {
        id: {
            type: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        accountName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                  msg: 'Account name is required'
                },
                notEmpty: {
                  msg: 'Account name field cannot be empty'
                }
              }
        },
        bankName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bankCode: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
       sequelize: db,
        modelName: 'Bank'
    }
);