package com.ctrlaltcomplete.trivia.model;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

@SpringBootTest
public class UserTests {

    private static User testUser;
//    private static LocalDateTime now;
    private static LocalDateTime now = LocalDateTime.now();


    @BeforeAll
    public static void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setPassword("password");
        testUser.setEmail("email@mail.com");
        testUser.setFullName("full name");
//        LocalDateTime now = LocalDateTime.now();
        testUser.setRegisteredAt(now);
    }

     @Test
     void userCreated() {
         assertEquals(testUser.getId(), 1L);
         assertEquals(testUser.getPassword(), "password");
         assertEquals(testUser.getEmail(), "email@mail.com");
         assertEquals(testUser.getFullName(), "full name");
         assertEquals(testUser.getRegisteredAt(), now);
     }
 }