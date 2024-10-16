package com.ctrlaltcomplete.trivia.repository;

import com.ctrlaltcomplete.trivia.model.GameQuestion;
import org.springframework.data.repository.CrudRepository;

public interface GameQuestionRepository extends CrudRepository<GameQuestion, Long> {
}
