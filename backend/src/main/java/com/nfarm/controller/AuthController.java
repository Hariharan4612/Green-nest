package com.nfarm.controller;

import com.nfarm.dto.LoginRequest;
import com.nfarm.dto.RegisterRequest;
import com.nfarm.model.User;
import com.nfarm.repository.UserRepository;
import com.nfarm.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public AuthController(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    /**
     * Create User (Sign Up):
     * Receives name, email, password and directly saves client to MySQL users table.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty() ||
            request.getEmail() == null || request.getEmail().trim().isEmpty() ||
            request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Name, email and password are required."
            ));
        }

        String email = request.getEmail().trim().toLowerCase();

        // Check if user already exists in SQL database
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "success", false,
                "message", "An account with this email already exists. Please log in."
            ));
        }

        // Save directly to SQL
        User user = new User(request.getName().trim(), email, request.getPassword().trim(), "client");
        User savedUser = userRepository.save(user);

        Map<String, Object> userData = new LinkedHashMap<>();
        userData.put("id", savedUser.getId());
        userData.put("name", savedUser.getName());
        userData.put("email", savedUser.getEmail());
        userData.put("role", savedUser.getRole());
        userData.put("phone", savedUser.getPhone());
        userData.put("city", savedUser.getCity());
        userData.put("state", savedUser.getState());
        userData.put("pinCode", savedUser.getPinCode());
        userData.put("address", savedUser.getAddress());
        userData.put("isLoggedIn", true);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "User created and saved to database successfully!");
        response.put("user", userData);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login:
     * Checks if valid user and password in MySQL database. If valid, login!
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty() ||
            request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Email and password are required."
            ));
        }

        String inputId = request.getEmail().trim().toLowerCase();
        String password = request.getPassword().trim();

        // Check if valid user in SQL database
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(inputId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (password.equals(user.getPassword())) {
                Map<String, Object> clientData = new LinkedHashMap<>();
                clientData.put("id", user.getId());
                clientData.put("name", user.getName());
                clientData.put("email", user.getEmail());
                clientData.put("role", user.getRole());
                clientData.put("phone", user.getPhone());
                clientData.put("city", user.getCity());
                clientData.put("state", user.getState());
                clientData.put("pinCode", user.getPinCode());
                clientData.put("address", user.getAddress());
                clientData.put("isLoggedIn", true);

                Map<String, Object> response = new LinkedHashMap<>();
                response.put("success", true);
                response.put("message", "Login successful!");
                response.put("user", clientData);

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "success", false,
            "message", "Invalid email or password. Please verify your credentials or create an account."
        ));
    }

    /**
     * Update User Profile (Address, City, State, Pin Code, Phone)
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email is required."));
        }
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email.trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "User not found."));
        }
        User user = userOpt.get();
        if (body.containsKey("name") && body.get("name") != null) user.setName(body.get("name").trim());
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        if (body.containsKey("city")) user.setCity(body.get("city"));
        if (body.containsKey("state")) user.setState(body.get("state"));
        if (body.containsKey("pinCode")) user.setPinCode(body.get("pinCode"));
        if (body.containsKey("address")) user.setAddress(body.get("address"));

        User saved = userRepository.save(user);

        Map<String, Object> clientData = new LinkedHashMap<>();
        clientData.put("id", saved.getId());
        clientData.put("name", saved.getName());
        clientData.put("email", saved.getEmail());
        clientData.put("role", saved.getRole());
        clientData.put("phone", saved.getPhone());
        clientData.put("city", saved.getCity());
        clientData.put("state", saved.getState());
        clientData.put("pinCode", saved.getPinCode());
        clientData.put("address", saved.getAddress());
        clientData.put("isLoggedIn", true);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Profile updated successfully!",
            "user", clientData
        ));
    }

    /**
     * Get list of registered clients from SQL database
     */
    @GetMapping("/clients")
    public ResponseEntity<?> getClients() {
        List<User> clients = userRepository.findByRoleIgnoreCase("client");
        return ResponseEntity.ok(Map.of(
            "success", true,
            "count", clients.size(),
            "clients", clients
        ));
    }

    /**
     * Forgot Password:
     * Generates a unique 30-minute reset token, saves it to the user, and sends
     * a password reset email to the user's Gmail address.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Email address is required."
            ));
        }

        String normalizedEmail = email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(normalizedEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success", false,
                "message", "No account registered with this email address. Please check or create an account."
            ));
        }

        User user = userOpt.get();

        // Generate secure random reset token (valid for 30 minutes)
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordExpiry(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        // Build reset link
        String baseUrl = (frontendUrl != null && !frontendUrl.isBlank()) ? frontendUrl.replaceAll("/+$", "") : "http://localhost:5173";
        String resetLink = baseUrl + "/reset-password?token=" + token;

        // Dispatch email via Gmail SMTP
        boolean sentViaSmtp = false;
        try {
            sentViaSmtp = emailService.sendPasswordResetEmail(user.getEmail(), resetLink, user.getName());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Failed to send email via SMTP: " + e.getMessage()
            ));
        }

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("success", true);
        resp.put("message", sentViaSmtp
            ? "Password reset link sent successfully to " + user.getEmail() + "!"
            : "Reset link generated. (SMTP credentials not yet configured; link logged to server console)");
        resp.put("sentViaSmtp", sentViaSmtp);
        resp.put("resetLink", resetLink);

        return ResponseEntity.ok(resp);
    }

    /**
     * Reset Password:
     * Validates reset token and expiration, then updates user's password.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        if (newPassword == null) {
            newPassword = body.get("password");
        }

        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Reset token is required."
            ));
        }

        if (newPassword == null || newPassword.trim().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Password must be at least 6 characters long."
            ));
        }

        Optional<User> userOpt = userRepository.findByResetPasswordToken(token.trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Invalid or already used password reset token."
            ));
        }

        User user = userOpt.get();
        if (user.getResetPasswordExpiry() == null || user.getResetPasswordExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Password reset link has expired. Please request a new one."
            ));
        }

        // Update password and invalidate token
        user.setPassword(newPassword.trim());
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Password has been successfully reset! You can now log in with your new password."
        ));
    }
}
