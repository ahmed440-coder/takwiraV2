package com.example.takwira.service;

import com.example.takwira.model.Stadium;
import com.example.takwira.repository.StadiumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StadiumService {

    @Autowired
    private StadiumRepository stadiumRepository;

    // Existing saveStadium method 
    public Stadium saveStadium(Stadium stadium) {
        System.out.println("******************hear service" + stadium);
        return stadiumRepository.save(stadium); // Saves the stadium to the DB
    }

    // New method to fetch all stadiums from the database
    public List<Stadium> getAllStadiums() {
        return stadiumRepository.findAll(); // Retrieves all stadiums from the repository
    }
}
