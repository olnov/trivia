package com.ctrlaltcomplete.trivia.dto;

public class ScoresDto {
    private Long userId;
    private String fullName;
    private Long totalScore;

    public ScoresDto(Long userId, String fullName, Long totalScore) {
        this.userId = userId;
        this.fullName = fullName;
        this.totalScore = totalScore;
    }

    public ScoresDto() {

    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Long getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Long totalScore) {
        this.totalScore = totalScore;
    }
}
