package com.example.takwira.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "booking")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor 
public class Booking {

    @Id 
    private String id;
    private Stadium stadium;  // Assuming you have a Stadium entity
    private User user;  // Assuming you have a User entity
    private LocalDateTime bookingDateTime;

    // Constructors, Getters, and Setters
    

    public Booking(Stadium stadium, User user, LocalDateTime bookingDateTime) {
        this.stadium = stadium;
        this.user = user;
        this.bookingDateTime = bookingDateTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Stadium getStadium() {
        return stadium;
    }

    public void setStadium(Stadium stadium) {
        this.stadium = stadium;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getBookingDateTime() {
        return bookingDateTime;
    }

    public void setBookingDateTime(LocalDateTime bookingDateTime) {
        this.bookingDateTime = bookingDateTime;
    }
    
}
