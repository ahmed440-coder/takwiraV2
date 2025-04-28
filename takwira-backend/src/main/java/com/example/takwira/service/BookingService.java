package com.example.takwira.service;

import com.example.takwira.model.Booking;
import com.example.takwira.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create a new booking, with basic double booking check
    public Booking saveBooking(Booking booking) {
        // Prevent double booking for the same stadium (by id) at the same date/time
        List<Booking> existing = bookingRepository.findAll();
        for (Booking b : existing) {
            if (b.getStadium() != null && booking.getStadium() != null &&
                b.getStadium().getId().equals(booking.getStadium().getId()) &&
                b.getBookingDateTime() != null && b.getBookingDateTime().equals(booking.getBookingDateTime())) {
                throw new RuntimeException("Stadium already booked for this date/time");
            }
        }
        return bookingRepository.save(booking);
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get booking by id
    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    // Add more logic as needed (e.g., by user, by stadium)
}
