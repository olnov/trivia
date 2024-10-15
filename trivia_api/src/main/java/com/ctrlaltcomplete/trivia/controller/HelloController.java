package com.ctrlaltcomplete.trivia.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String sayHello (HttpSession session) {
        return "Hello from trivia" + session.getId();
    }
}
