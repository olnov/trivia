package com.ctrlaltcomplete.trivia.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "GAMES")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "is_completed")
    private Boolean isCompleted;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GameQuestion> gameQuestions = new ArrayList<>();

    public Game() {}

    public Game(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }
}
