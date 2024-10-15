package com.ctrlaltcomplete.trivia.repository;

import com.ctrlaltcomplete.trivia.model.Game;
import org.springframework.data.repository.CrudRepository;

public interface GameRepository extends CrudRepository<Game,Long> {
}
