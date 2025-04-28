package com.example.takwira.repository;



import com.example.takwira.model.User;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> { 
    Optional<User> findByEmail(String email);
    Optional<User> findById(String id);
}

