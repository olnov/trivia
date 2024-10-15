package com.ctrlaltcomplete.trivia.repository;

import com.ctrlaltcomplete.trivia.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User,Long> {
}
