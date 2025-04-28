package com.example.takwira.repository;

import com.example.takwira.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    // Find all bookings for a specific stadium at a specific date/time
    List<Booking> findByStadium_IdAndBookingDateTime(String stadiumId, java.time.LocalDateTime bookingDateTime);
    // You can add more custom queries here as needed
}
