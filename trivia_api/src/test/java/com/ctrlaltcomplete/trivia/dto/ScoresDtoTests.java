package com.ctrlaltcomplete.trivia.dto;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

import java.security.PublicKey;

public class ScoresDtoTests {

    private ScoresDto scoresDto;

    @BeforeEach
    public void setUp () {
        scoresDto = new ScoresDto(1L, "Full Name", 20L);
    }

    @Test
    public void createNewScoreDto() {
        assertEquals(scoresDto.getUserId(), 1);
        assertEquals(scoresDto.getFullName(), "Full Name");
        assertEquals(scoresDto.getTotalScore(), 20);
    }

    @Test
    public void testingSettersScoresDto() {
        ScoresDto scoresDto2 = new ScoresDto();
        scoresDto2.setUserId(2L);
        scoresDto2.setFullName("Test Two");
        scoresDto2.setTotalScore(30L);
        assertEquals(scoresDto2.getUserId(), 2);
        assertEquals(scoresDto2.getFullName(), "Test Two");
        assertEquals(scoresDto2.getTotalScore(), 30);
    }

}
