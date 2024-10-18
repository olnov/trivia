package com.ctrlaltcomplete.trivia.dto;

public class AnswersDto {
    private String question_id;
    private String player_id;
    private String trivia_id;
    private String players_answer;
    private String correct_answer;
    private String is_correct;
    private String difficulty;
    private String score;
    private String answered_at;

    public String getQuestion_id() {
        return question_id;
    }

    public void setQuestion_id(String question_id) {
        this.question_id = question_id;
    }

    public String getPlayer_id() {
        return player_id;
    }

    public void setPlayer_id(String player_id) {
        this.player_id = player_id;
    }

    public String getTrivia_id() {
        return trivia_id;
    }

    public void setTrivia_id(String trivia_id) {
        this.trivia_id = trivia_id;
    }

    public String getPlayers_answer() {
        return players_answer;
    }

    public void setPlayers_answer(String players_answer) {
        this.players_answer = players_answer;
    }

    public String getCorrect_answer() {
        return correct_answer;
    }

    public void setCorrect_answer(String correct_answer) {
        this.correct_answer = correct_answer;
    }

    public String getIs_correct() {
        return is_correct;
    }

    public void setIs_correct(String is_correct) {
        this.is_correct = is_correct;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getAnswered_at() {
        return answered_at;
    }

    public void setAnswered_at(String answered_at) {
        this.answered_at = answered_at;
    }
}
