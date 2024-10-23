package com.ctrlaltcomplete.trivia.repository;

import com.ctrlaltcomplete.trivia.dto.ScoresDto;
import com.ctrlaltcomplete.trivia.model.GameQuestion;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface GameQuestionRepository extends CrudRepository<GameQuestion, Long> {
    @Query("SELECT new com.ctrlaltcomplete.trivia.dto.ScoresDto(u.id, u.fullName, SUM(gq.score)) " +
            "FROM User u JOIN GameQuestion gq ON u.id = gq.user.id " +
            "GROUP BY u.id, u.fullName " +
            "ORDER BY SUM(gq.score) DESC")
    List<ScoresDto> getScoreBoard(Pageable pageable);

}
