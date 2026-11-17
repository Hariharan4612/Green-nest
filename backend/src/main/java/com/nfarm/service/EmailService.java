package com.nfarm.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:unofficialhuman404@gmail.com}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Sends password reset email with secure link to user's Gmail/email address.
     *
     * @param toEmail   Recipient email address
     * @param resetLink Full URL to reset password page including token
     * @param userName  Recipient display name
     * @return boolean indicating whether the email was sent through SMTP
     */
    public boolean sendPasswordResetEmail(String toEmail, String resetLink, String userName) {
        String displayName = (userName != null && !userName.trim().isEmpty()) ? userName : "GreenNest Gardener";

        // Console log backup so developer/admin can always test even without SMTP credentials
        logger.info("================================================================================");
        logger.info("PASSWORD RESET REQUEST for: {}", toEmail);
        logger.info("RESET LINK: {}", resetLink);
        logger.info("================================================================================");

        if (mailSender == null || fromEmail == null || fromEmail.trim().isEmpty()) {
            logger.warn("Gmail SMTP username is not configured (MAIL_USERNAME). Email not dispatched via SMTP. " +
                        "Configure spring.mail.username and spring.mail.password in application.yml to enable real Gmail delivery.");
            return false;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail, "Green-nest admin");
            helper.setTo(toEmail);
            helper.setSubject("🌱 Reset Your GreenNest Account Password");

            String html = buildResetPasswordHtml(displayName, resetLink);
            helper.setText(html, true);

            mailSender.send(mimeMessage);
            logger.info("Password reset email successfully sent to {}", toEmail);
            return true;
        } catch (Exception e) {
            logger.error("Error dispatching password reset email to {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException(e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName(), e);
        }
    }

    private String buildResetPasswordHtml(String userName, String resetLink) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f7faf7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                  <td align="center" style="padding: 40px 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2ece0; box-shadow: 0 10px 25px rgba(20, 46, 27, 0.05); overflow: hidden;">
                      <!-- Header -->
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #1e4d2b 0%, #142e1b 100%); padding: 32px 24px; color: #ffffff;">
                          <div style="font-size: 32px; line-height: 1; margin-bottom: 8px;">🌿</div>
                          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">GreenNest</h1>
                          <p style="margin: 6px 0 0; font-size: 13px; color: #a7f3d0; letter-spacing: 0.5px; text-transform: uppercase;">Botanical Nursery & Care</p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 36px 32px;">
                          <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #142e1b;">Password Reset Request</h2>
                          <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #4a5568;">
                            Hello <strong>%s</strong>,
                          </p>
                          <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #4a5568;">
                            We received a request to reset the password for your GreenNest account. Click the button below to choose a new password. This link is valid for <strong>30 minutes</strong>.
                          </p>
                          
                          <!-- CTA Button -->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="margin-bottom: 24px;">
                            <tr>
                              <td align="center">
                                <a href="%s" target="_blank" style="display: inline-block; background-color: #1e4d2b; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(30, 77, 43, 0.25);">
                                  Reset Password
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <p style="margin: 0 0 12px; font-size: 12px; line-height: 1.5; color: #718096;">
                            If the button above does not work, copy and paste this link into your browser:
                          </p>
                          <p style="margin: 0 0 24px; font-size: 11px; line-height: 1.4; color: #1e4d2b; word-break: break-all; background-color: #f7faf7; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2ece0;">
                            <a href="%s" style="color: #1e4d2b; text-decoration: underline;">%s</a>
                          </p>
                          
                          <hr style="border: none; border-top: 1px solid #edf2f7; margin: 24px 0;" />
                          
                          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #a0aec0;">
                            If you did not request a password reset, you can safely ignore this email. Your account password will remain unchanged.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td align="center" style="background-color: #f7faf7; padding: 20px; font-size: 11px; color: #a0aec0; border-top: 1px solid #e2ece0;">
                          © 2026 GreenNest Botanical Nursery. All rights reserved.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(userName, resetLink, resetLink, resetLink);
    }

    /**
     * Sends a welcome email to the newly registered user's Gmail.
     *
     * @param toEmail  Recipient email address
     * @param userName Recipient display name
     * @return boolean indicating whether the email was sent through SMTP
     */
    public boolean sendWelcomeEmail(String toEmail, String userName) {
        String displayName = (userName != null && !userName.trim().isEmpty()) ? userName : "Plant Enthusiast";

        logger.info("================================================================================");
        logger.info("WELCOME EMAIL TRIGGERED for registered user: {} ({})", displayName, toEmail);
        logger.info("================================================================================");

        if (mailSender == null || fromEmail == null || fromEmail.trim().isEmpty()) {
            logger.warn("Gmail SMTP username is not configured (MAIL_USERNAME). Welcome email not dispatched via SMTP. " +
                        "Configure spring.mail.username and spring.mail.password in application.yml to enable real Gmail delivery.");
            return false;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail, "Green-nest admin");
            helper.setTo(toEmail);
            helper.setSubject("🌿 Welcome to GreenNest, " + displayName + "! Your Green Haven Awaits");

            String html = buildWelcomeEmailHtml(displayName);
            helper.setText(html, true);

            mailSender.send(mimeMessage);
            logger.info("Welcome email successfully sent via Gmail SMTP to {}", toEmail);
            return true;
        } catch (Exception e) {
            logger.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage(), e);
            return false;
        }
    }

    private String buildWelcomeEmailHtml(String userName) {
        String baseUrl = (frontendUrl != null && !frontendUrl.isBlank()) ? frontendUrl.replaceAll("/+$", "") : "http://localhost:5173";
        String shopLink = baseUrl + "/shop";

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to GreenNest</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f7faf7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="table-layout: fixed;">
                <tr>
                  <td align="center" style="padding: 40px 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 560px; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2ece0; box-shadow: 0 10px 25px rgba(20, 46, 27, 0.05); overflow: hidden;">
                      <!-- Header -->
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #1e4d2b 0%%, #142e1b 100%%); padding: 36px 24px; color: #ffffff;">
                          <div style="font-size: 36px; line-height: 1; margin-bottom: 8px;">🌱</div>
                          <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">Welcome to GreenNest!</h1>
                          <p style="margin: 6px 0 0; font-size: 13px; color: #a7f3d0; letter-spacing: 0.5px; text-transform: uppercase;">Botanical Nursery & Care</p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 36px 32px;">
                          <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #142e1b;">Hello %s,</h2>
                          <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #4a5568;">
                            Thank you for joining <strong>GreenNest</strong>! We are thrilled to welcome you to our community of indoor plant lovers, gardeners, and botanical enthusiasts.
                          </p>
                          <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #4a5568;">
                            Your account has been successfully created. You can now explore our curated plant collection, build your personalized plant wishlist, access care schedules, and order fresh nursery plants directly to your door.
                          </p>
                          
                          <!-- CTA Button -->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="margin-bottom: 24px;">
                            <tr>
                              <td align="center">
                                <a href="%s" target="_blank" style="display: inline-block; background-color: #1e4d2b; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(30, 77, 43, 0.25);">
                                  Explore Plant Shop
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <div style="background-color: #f7faf7; border: 1px solid #e2ece0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                            <h3 style="margin: 0 0 8px; font-size: 13px; font-weight: 700; color: #1e4d2b;">🌿 Quick Tips to Get Started:</h3>
                            <ul style="margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.6; color: #4a5568;">
                              <li>Browse curated categories: Indoor Air Purifiers, Succulents, and Flowered plants.</li>
                              <li>Save your favorites to your personal Wishlist.</li>
                              <li>Keep track of watering schedules with our Plant Care guides.</li>
                            </ul>
                          </div>
                          
                          <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #718096;">
                            Need help? Reply directly to this email or reach out to our green support team anytime. Happy planting!
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td align="center" style="background-color: #f7faf7; padding: 20px; font-size: 11px; color: #a0aec0; border-top: 1px solid #e2ece0;">
                          © 2026 GreenNest Botanical Nursery. All rights reserved.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(userName, shopLink);
    }
}

