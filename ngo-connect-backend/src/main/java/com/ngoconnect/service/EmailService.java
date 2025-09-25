package com.ngoconnect.service;

import com.ngoconnect.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${app.email.verification.required:true}")
    private boolean emailVerificationRequired;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendVerificationEmail(User user) {
        if (!emailVerificationRequired) {
            return; // Skip email sending if verification is not required
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Email Verification - NGO Connect");
        message.setText("Dear " + user.getFullName() + ",\n\n" +
                "Thank you for registering with NGO Connect. Please click the link below to verify your email address:\n\n" +
                "http://localhost:3000/verify-email?email=" + user.getEmail() + "\n\n" +
                "If you did not create an account, please ignore this email.\n\n" +
                "Best regards,\n" +
                "NGO Connect Team");

        if (mailSender != null) {
            mailSender.send(message);
        } else {
            System.out.println("Email not sent - mail sender not configured");
        }
    }

    public void sendPasswordResetEmail(User user, String resetToken) {
        if (mailSender == null) {
            System.out.println("Email not sent - mail sender not configured");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Password Reset - NGO Connect");
            message.setText("Dear " + user.getFullName() + ",\n\n" +
                    "You have requested to reset your password. Please click the link below to reset your password:\n\n" +
                    "http://localhost:3000/reset-password?token=" + resetToken + "\n\n" +
                    "This link will expire in 24 hours.\n\n" +
                    "If you did not request this, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "NGO Connect Team");
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
    }
    
    public void sendDonationConfirmationEmail(User user, String ngoName, Double amount) {
        if (mailSender == null) {
            System.out.println("Email not sent - mail sender not configured");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Donation Confirmation - NGO Connect");
            message.setText("Dear " + user.getFullName() + ",\n\n" +
                    "Thank you for your generous donation of $" + amount + " to " + ngoName + ".\n\n" +
                    "Your contribution will make a significant difference in the lives of those we serve.\n\n" +
                    "You can view your donation history in your dashboard.\n\n" +
                    "Best regards,\n" +
                    "NGO Connect Team");
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send donation confirmation email: " + e.getMessage());
        }
    }
    
    public void sendVolunteerApplicationConfirmationEmail(User user, String opportunityTitle) {
        if (mailSender == null) {
            System.out.println("Email not sent - mail sender not configured");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Volunteer Application Received - NGO Connect");
            message.setText("Dear " + user.getFullName() + ",\n\n" +
                    "Thank you for applying to volunteer for: " + opportunityTitle + "\n\n" +
                    "We have received your application and will review it shortly. You will be notified of the status within 2-3 business days.\n\n" +
                    "You can track your application status in your volunteer dashboard.\n\n" +
                    "Best regards,\n" +
                    "NGO Connect Team");
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send volunteer application confirmation email: " + e.getMessage());
        }
    }
}
