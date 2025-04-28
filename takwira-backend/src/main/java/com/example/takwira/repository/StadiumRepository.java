package com.example.takwira.repository;

import com.example.takwira.model.Stadium;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StadiumRepository extends MongoRepository<Stadium, String> { 
    // Custom query methods can be added here if needed
}
 
