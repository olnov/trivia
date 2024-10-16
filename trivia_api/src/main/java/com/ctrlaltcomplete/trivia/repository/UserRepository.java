package com.ctrlaltcomplete.trivia.repository;

import com.ctrlaltcomplete.trivia.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User,Long> {
    Optional<User> findByEmail(String email);
}

