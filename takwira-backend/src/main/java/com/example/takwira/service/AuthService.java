package com.example.takwira.service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import com.example.takwira.model.User;
import com.example.takwira.repository.UserRepository;
import com.example.takwira.util.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtService;
    private final AuthenticationManager authenticationManager;
    private final Set<String> blacklistedTokens = new HashSet<>();
    

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public User register(User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            throw new RuntimeException("Email and Password must not be null");
        }
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email is already in use");
        }
        // Encode password
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        // Ensure role is set
        
        // Set birthday from form if present and not already set
        if (user.getBirthday() == null && user.getUsername() != null) {
            // Try to get birthday from username as a workaround (debug)
            System.out.println("Birthday is null in user object during registration");
        }
        System.out.println("User is saved!!");
        return userRepository.save(user);
    }

    public String login(User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            throw new RuntimeException("Email and Password must not be null");
        }
        User existingUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );
        System.out.println("user is logged in!!");
        return jwtService.generateToken(existingUser);
    }

    public void invalidateToken(String token) {
        // Add token to the blacklist (in-memory or Redis)
        blacklistedTokens.add(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    public void logout(String token) {
        blacklistedTokens.add(token);
        System.out.println("user is out !!!!!!");
        System.out.println("Token invalidated and blacklisted: " + token);
    }
}