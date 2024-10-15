package com.ctrlaltcomplete.trivia.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String sayHello(HttpSession session) {
        return "<html>" +
                "<body>" +
                "<h1>Welcome young Quizzard!</h1>" +
                "<p>Session ID: " + session.getId() + "</p>" +
                "<p><strong>Welcome to Quiznados!</strong></p>" +
                "<p>Well done on logging in and creating your profile. </p>" +
                "<p>When ready, click <strong>begin</strong> to start your journey to become a quizzard.</p>" +
                "<p>Alternatively, see your score on the <strong>leaderboard</strong>.</p>" +
                "<p>Stay tuned for new changes soon!</p>" +

                "<a href='/game-on'><button>Begin</button></a>" +
                "<a href='/leaderboard'><button>Leaderboard</button></a>" +

                "</body>" +
                "</html>";
    }

    @GetMapping("/game-on")
    public String begin() {
        return "<html><body><h1>Game On!</h1><p>Welcome to the quiz!</p></body></html>";
    }

    @GetMapping("/leaderboard")
    public String leaderboard() {
        return "<html><body><h1>Leaderboard</h1><p>Here are the top scores!</p></body></html>";
    }
}
