"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'First name is required',
            },
            notEmpty: {
                msg: 'First name cannot be empty',
            },
        },
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Last name is required',
            },
            notEmpty: {
                msg: 'Last name cannot be empty',
            },
        },
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Username is required',
            },
            notEmpty: {
                msg: 'Username cannot be empty',
            },
        },
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Email is required',
            },
            notEmpty: {
                msg: 'Email cannot be empty',
            },
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password is required',
            },
            notEmpty: {
                msg: 'Password cannot be empty',
            },
        },
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Phone number is required',
            },
            notEmpty: {
                msg: 'Phone number cannot be empty',
            },
        },
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    walletBalance: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: db,
    modelName: 'User',
});
UserInstance.hasMany(BankInstance, { foreignKey: 'userId', as: 'banks' });
BankInstance.belongsTo(UserInstance, { foreignKey: 'userId', as: 'User' });
UserInstance.hasMany(TransactionInstance, { foreignKey: 'userId', as: 'transactions' });
TransactionInstance.belongsTo(UserInstance, { foreignKey: 'userId', as: 'User' });
UserInstance.hasMany(WithdrawalHistoryInstance, { foreignKey: 'userId', as: 'withdrawalHistory' });
WithdrawalHistoryInstance.belongsTo(UserInstance, { foreignKey: 'userId', as: 'User' });
//# sourceMappingURL=users.js.map