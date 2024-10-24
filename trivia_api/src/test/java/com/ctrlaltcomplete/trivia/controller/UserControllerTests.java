package com.ctrlaltcomplete.trivia.controller;

import com.ctrlaltcomplete.trivia.dto.AuthRequest;
import com.ctrlaltcomplete.trivia.model.User;
import com.ctrlaltcomplete.trivia.repository.UserRepository;
import com.ctrlaltcomplete.trivia.security.CustomUserDetailsService;
import com.ctrlaltcomplete.trivia.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class UserControllerTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFetchAllUsers() {
        User user1 = new User();
        user1.setId(1L);
        user1.setFullName("name 1");
        user1.setEmail("email1@mail.com");
        user1.setPassword("password 1");
        User user2 = new User();
        user2.setId(2L);
        user2.setFullName("name 2");
        user2.setEmail("email2@mail.com");
        user2.setPassword("password 2");
        List<User> list = new ArrayList<>();
        list.add(user1);
        list.add(user2);

        when(userRepository.findAll()).thenReturn(list);

//        ResponseEntity<List<User>> result = userController.getAllUsers();

//        assertEquals(new ResponseEntity<>(list, HttpStatus.OK), result);
    }

    @Test
    void testFetchOneUser() {
        User user1 = new User();
        user1.setId(1L);
        user1.setFullName("name 1");
        user1.setEmail("email1@mail.com");
        user1.setPassword("password 1");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));

        ResponseEntity<User> result = userController.getUserById(1L);

        assertEquals(new ResponseEntity<>(user1, HttpStatus.OK), result);
    }

    @Test
    void testFetchUserThatDoesntExist(){
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<User> result = userController.getUserById(1L);

        assertEquals(new ResponseEntity<>(HttpStatus.NOT_FOUND),result);
    }

    @Test
    void testNewUser() {
        User user1 = new User();
        user1.setId(1L);
        user1.setFullName("name 1");
        user1.setEmail("email1@mail.com");
        user1.setPassword("password 1");

        ResponseEntity<User> result = userController.createUser(user1);

        assertEquals(new ResponseEntity<>(HttpStatus.CREATED), result);

        verify(userDetailsService).saveUser(argThat(user -> user.getId().equals(1L) &&
                user.getFullName().equals("name 1") &&
                user.getEmail().equals("email1@mail.com") &&
                user.getPassword().equals("password 1")
        ));
    }

    @Test
    void testErrorCreatingUser(){
        User user1 = new User();
        user1.setId(1L);
        user1.setFullName("name 1");
        user1.setEmail("email1@mail.com");
        user1.setPassword("password 1");

        when(userDetailsService.saveUser(user1)).thenThrow(NullPointerException.class);

        ResponseEntity<User> result = userController.createUser(user1);

        assertEquals(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR), result);

        verify(userDetailsService).saveUser(argThat(user -> user.getId().equals(1L) &&
                user.getFullName().equals("name 1") &&
                user.getEmail().equals("email1@mail.com") &&
                user.getPassword().equals("password 1")
        ));
    }

    @Test
    void testDeleteUser() {
        User user1 = new User();
        user1.setId(1L);
        user1.setFullName("name 1");
        user1.setEmail("email1@mail.com");
        user1.setPassword("password 1");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));

        ResponseEntity<User> result = userController.deleteUser(1L);

        assertEquals(new ResponseEntity<>(HttpStatus.NO_CONTENT), result);

        verify(userRepository).delete(argThat(user -> user.getId().equals(1L) &&
                user.getFullName().equals("name 1") &&
                user.getEmail().equals("email1@mail.com") &&
                user.getPassword().equals("password 1")
        ));
    }

    @Test
    void testDeleteNonExistentUser(){
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<User> result = userController.deleteUser(1L);

        assertEquals(new ResponseEntity<>(HttpStatus.NOT_FOUND), result);
    }

    @Test
    void testUpdateUser() {
        User user1 = new User();
        user1.setId(1L);
        user1.setFullName("name 1");
        user1.setEmail("email1@mail.com");
        user1.setPassword("password 1");

        User updatedUser1 = new User();
        updatedUser1.setFullName("name 2");
        updatedUser1.setEmail("email2@mail.com");
        updatedUser1.setPassword("password 2");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));

        ResponseEntity<User> result = userController.replaceUser(1L, updatedUser1);

        verify(userRepository).save(argThat(user -> user.getId().equals(1L) &&
                user.getFullName().equals("name 2") &&
                user.getEmail().equals("email2@mail.com") &&
                user.getPassword().equals("password 2")
        ));

        updatedUser1.setId(1L);

        assertEquals(new ResponseEntity<>(HttpStatus.OK), result);
    }

    @Test
    void testUpdateNonExistentUser(){
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        User updatedUser = new User();
        ResponseEntity<User> result = userController.replaceUser(1L, updatedUser);
        assertEquals(new ResponseEntity<>(HttpStatus.NOT_FOUND), result);

    }

    @Test
    void testUpdateWithEmptyUser(){
        User user1 = new User();
        user1.setId(1L);
        user1.setFullName("name 1");
        user1.setEmail("email1@mail.com");
        user1.setPassword("password 1");

        User updatedUser1 = new User();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));

        ResponseEntity<User> result = userController.replaceUser(1L, updatedUser1);

        verify(userRepository).save(argThat(user -> user.getId().equals(1L) &&
                user.getFullName().equals("name 1") &&
                user.getEmail().equals("email1@mail.com") &&
                user.getPassword().equals("password 1")
        ));

        assertEquals(new ResponseEntity<>(HttpStatus.OK), result);
    }

    @Test
    void testLogin() {
        User user1 = new User();
        user1.setId(1L);
        user1.setFullName("name 1");
        user1.setEmail("email1@mail.com");
        user1.setPassword("password 1");
        when(userRepository.findByEmail("email1@mail.com")).thenReturn(Optional.of(user1));
        when(passwordEncoder.matches("password 1","password 1")).thenReturn(true);
        when(jwtUtil.generateToken("email1@mail.com",1L)).thenReturn("token");
        AuthRequest authRequest = new AuthRequest();
        authRequest.setPassword("password 1");
        authRequest.setEmail("email1@mail.com");
        ResponseEntity<Map<String,String>> response = userController.loginUser(authRequest);
        Map<String,String> expectedResponse = new HashMap<>();
        expectedResponse.put("token", "token");
        expectedResponse.put("userId", "1");

        assertEquals(ResponseEntity.ok(expectedResponse), response);
    }

    @Test
    void testLoginAsNonExistentUser(){
        when(userRepository.findByEmail("email1@mail.com")).thenReturn(Optional.empty());
        AuthRequest authRequest = new AuthRequest();
        authRequest.setPassword("password 1");
        authRequest.setEmail("email1@mail.com");
        ResponseEntity<Map<String,String>> response = userController.loginUser(authRequest);
        Map<String,String> expectedError = new HashMap<>();
        expectedError.put("message","Invalid credentials");

        assertEquals(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(expectedError), response);
    }

    @Test
    void testLoginWithInvalidCredentials(){
        User user1 = new User();
        user1.setId(1L);
        user1.setFullName("name 1");
        user1.setEmail("email1@mail.com");
        user1.setPassword("password 1");
        when(userRepository.findByEmail("email1@mail.com")).thenReturn(Optional.of(user1));
        when(passwordEncoder.matches("password 1","password 12")).thenReturn(false);
        AuthRequest authRequest = new AuthRequest();
        authRequest.setPassword("password 2");
        authRequest.setEmail("email1@mail.com");

        ResponseEntity<Map<String,String>> response = userController.loginUser(authRequest);

        Map<String,String> expectedError = new HashMap<>();
        expectedError.put("message","Invalid credentials");

        assertEquals(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(expectedError), response);
    }
}
