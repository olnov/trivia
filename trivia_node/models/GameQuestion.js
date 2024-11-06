const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');
const User = require('../models/User');

const GameQuestion = sequelize.define('GameQuestion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    player_id: {  
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: User,
            key: 'id'
        }
    },
    players_answer: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'answer',
    },
    correct_answer: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    difficulty: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    answered_at: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            const rawDate = this.getDataValue('answered_at'); 
            return rawDate ? rawDate.toISOString().split('T')[0] : null;
        },
    }
}, {
    tableName: 'game_questions',
    timestamps: false,
});

User.hasMany(GameQuestion, { foreignKey: 'player_id' });
GameQuestion.belongsTo(User, { foreignKey: 'player_id' });

module.exports = GameQuestion;
