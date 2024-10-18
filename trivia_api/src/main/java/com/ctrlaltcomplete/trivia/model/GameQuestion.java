package com.ctrlaltcomplete.trivia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "GAME_QUESTIONS")
public class GameQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trivia_id")
    private Long triviaId;

    private String answer;

    @Column(name = "correct_answer")
    private String correctAnswer;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    private String difficulty;

    private Long score;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public GameQuestion() {}

    public GameQuestion(Long triviaId, String answer, String correctAnswer, Boolean isCorrect, String difficulty, Long score) {
        this.triviaId = triviaId;
        this.answer = answer;
        this.correctAnswer = correctAnswer;
        this.isCorrect = isCorrect;
        this.difficulty = difficulty;
        this.score = score;
    }
}
