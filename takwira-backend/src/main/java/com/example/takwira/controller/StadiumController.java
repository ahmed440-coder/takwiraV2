package com.example.takwira.controller;

import com.example.takwira.model.Stadium;
import com.example.takwira.service.StadiumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/stadiums")
public class StadiumController {

    @Autowired
    private StadiumService stadiumService;

    @PostMapping("/add")
    public Stadium createStadium(
            @RequestParam("stadiumName") String stadiumName,
            @RequestParam("region") String region,
            @RequestParam("slots") String slots,  // slots will be received as a JSON string
            @RequestParam("image") MultipartFile image) throws IOException {

        // Print the received stadium data for debugging purposes
        System.out.println("Stadium Name: " + stadiumName);
        System.out.println("Region: " + region);
        System.out.println("Slots: " + slots);
        
        // Create Stadium object based on received data
        Stadium stadium = new Stadium();
        stadium.setStadiumName(stadiumName);
        stadium.setRegion(region);
        stadium.setSlots(List.of(slots.split(","))); // Parsing slots if necessary (e.g., CSV format)
        
        // Convert image to Base64 string
        byte[] imageBytes = image.getBytes();
        String encodedImage = Base64.getEncoder().encodeToString(imageBytes);
        
        // Set the image in the stadium object
        stadium.setImage(encodedImage);

        // Save stadium to database using the service
        return stadiumService.saveStadium(stadium);
    }

    // New GET endpoint to fetch all stadiums
    @GetMapping("/getAll")
    public List<Stadium> getAllStadiums() {
        return stadiumService.getAllStadiums(); // Retrieve all stadiums from the service layer
    }
}
