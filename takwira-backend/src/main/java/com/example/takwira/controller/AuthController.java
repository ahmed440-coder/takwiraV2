package com.example.takwira.controller;

import com.example.takwira.model.User;
import com.example.takwira.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@ModelAttribute User user) {
        System.out.println(user);
        authService.register(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        String token = authService.login(user);
        return ResponseEntity.ok(token);
    }

@PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        // Get token from Authorization header
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("No token provided");
        }

        String token = authHeader.substring(7);

        // Optional: blacklist the token (if you're implementing token invalidation)
        authService.logout(token);

        return ResponseEntity.ok("User logged out successfully");
    }



}
