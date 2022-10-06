import { DataTypes, Model } from 'sequelize';

interface UserAttributes {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    avatar: string;
    walletBalance: number;
    role: string;
    isVerified: boolean;
}

export class UserInstance extends Model<UserAttributes> {}

UserInstance.init(
   {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: true,
      },
      walletBalance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize: db,
      modelName: 'User',
    },
  );
