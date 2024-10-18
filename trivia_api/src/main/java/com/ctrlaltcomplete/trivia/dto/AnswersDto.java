package com.ctrlaltcomplete.trivia.dto;

import java.time.LocalDateTime;

public class AnswersDto {
    private Long question_id;
    private Long player_id;
    private String players_answer;
    private String correct_answer;
    private Boolean is_correct;
    private String difficulty;
    private Long score;
    private String answered_at;

    public Long getQuestion_id() {
        return question_id;
    }

    public void setQuestion_id(Long question_id) {
        this.question_id = question_id;
    }

    public Long getPlayer_id() {
        return player_id;
    }

    public void setPlayer_id(Long player_id) {
        this.player_id = player_id;
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

    public Boolean getIs_correct() {
        return is_correct;
    }

    public void setIs_correct(Boolean is_correct) {
        this.is_correct = is_correct;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Long getScore() {
        return score;
    }

    public void setScore(Long score) {
        this.score = score;
    }

    public String getAnswered_at() {
        return answered_at;
    }

    public void setAnswered_at(String answered_at) {
        this.answered_at = answered_at;
    }
}
