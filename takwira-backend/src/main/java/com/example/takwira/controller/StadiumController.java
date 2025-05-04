package com.example.takwira.controller;

import com.example.takwira.model.Stadium;
import com.example.takwira.service.StadiumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/stadiums")
@CrossOrigin(origins = "*")
public class StadiumController {

    @Autowired
    private StadiumService stadiumService;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createStadium(
            @RequestParam("stadiumName") String stadiumName,
            @RequestParam("region") String region,
            @RequestParam("slots") String slots,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        try {
            // Validate input
            if (stadiumName == null || stadiumName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Stadium name is required");
            }
            if (region == null || region.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Region is required");
            }
            if (slots == null || slots.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Slots are required");
            }

            // Create Stadium object
            Stadium stadium = new Stadium();
            stadium.setStadiumName(stadiumName.trim());
            stadium.setRegion(region.trim());
            
            // Parse and validate slots
            List<String> slotList = Arrays.asList(slots.split(","));
            if (slotList.isEmpty()) {
                return ResponseEntity.badRequest().body("At least one slot is required");
            }
            stadium.setSlots(slotList);

            // Handle image if provided
            if (image != null && !image.isEmpty()) {
                try {
                    byte[] imageBytes = image.getBytes();
                    String encodedImage = Base64.getEncoder().encodeToString(imageBytes);
                    stadium.setImage(encodedImage);
                } catch (IOException e) {
                    return ResponseEntity.badRequest().body("Failed to process image: " + e.getMessage());
                }
            }

            // Save stadium
            Stadium savedStadium = stadiumService.saveStadium(stadium);
            return ResponseEntity.ok(savedStadium);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to create stadium: " + e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Stadium>> getAllStadiums() {
        try {
            List<Stadium> stadiums = stadiumService.getAllStadiums();
            return ResponseEntity.ok(stadiums);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
