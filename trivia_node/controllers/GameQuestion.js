const GameQuestion = require('../models/GameQuestion');
const { sequelize } = require('../db/db');
const { QueryTypes } = require('sequelize');

// Create a new score record. For one record.
exports.createScoreRecord = async (req, res) => {
    try {
        const { player_id, players_answer, correct_answer, is_correct, difficulty, score, answered_at } = req.body;
        const newScoreRecord = await GameQuestion.create({
            player_id: parseInt(player_id, 10), //Added aprseInt to conver string to int. For backward compatibility with Java BE.
            players_answer: players_answer,
            correct_answer: correct_answer,
            is_correct: is_correct,
            difficulty: difficulty,
            score: score,
            answered_at: new Date(answered_at),
        });
        res.status(201).json({ message: 'Successfully created: ', newScoreRecord });
    } catch (error) {
        res.status(500).json({ message: 'Error creating score record:', error: error.message });
    }
};

// Create a set of score records. Assuming that I'm getting an array of scores as an input.
exports.createScoreRecords = async (req, res) => {
    console.log("Received payload:", req.body);
    try {
        const scoreRecords = req.body;
        const createdRecords = [];

        for (const record of scoreRecords) {
            const { player_id, players_answer, correct_answer, is_correct, difficulty, score, answered_at } = record;
            const newScoreRecord = await GameQuestion.create({
                player_id: parseInt(player_id, 10), //Added aprseInt to conver string to int. For backward compatibility with Java BE.
                players_answer: players_answer,
                correct_answer: correct_answer,
                is_correct: is_correct,
                difficulty: difficulty,
                score: score,
                answered_at: new Date(answered_at),
            });
            createdRecords.push(newScoreRecord);
        }

        res.status(201).json({ message: 'Score record successfully created: ', createdRecords });

    } catch (error) {
        res.status(500).json({ message: 'Error creating score records: ', error: error.message });
    }
};

// Get result for the score board

exports.getScoreBoard = async (req, res) => {
    try {

        const scoreQuery = `
        SELECT u.id as "userId", 
            u.full_name as "fullName", 
            CAST(SUM(gq.score) as INTEGER) AS "totalScore"
        FROM users u 
        JOIN game_questions gq ON u.id = gq.user_id 
        GROUP BY u.id, u.full_name 
        LIMIT 10;
        `;
        
        const [results] = await sequelize.query(scoreQuery); 
        // It looks like there is a bug in Sequelize. If I add type: sequelize.QueryTypes.SELECT it returns just one record

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error getting score board: ', error: error.message });
    }
};
