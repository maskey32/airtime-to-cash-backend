"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class BankInstance extends sequelize_1.Model {
}
exports.BankInstance = BankInstance;
BankInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    accountName: {
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    accountNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    bankCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_config_1.default,
    modelName: 'Bank'
});
//# sourceMappingURL=bank.js.map