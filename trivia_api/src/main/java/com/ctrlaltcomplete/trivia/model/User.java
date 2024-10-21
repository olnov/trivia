package com.ctrlaltcomplete.trivia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    private String email;

    private String password;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GameQuestion> gameQuestions = new ArrayList<>();

    public User () {}

    @PrePersist
    protected void onCreate() {
        this.registeredAt = LocalDateTime.now();
    }

}
