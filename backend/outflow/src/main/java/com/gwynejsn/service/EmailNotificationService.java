package com.gwynejsn.service;

import com.gwynejsn.exception.NotFoundException;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.model.User;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailNotificationService {

    private final JavaMailSender javaMailSender;

    @Value("${company.email}")
    private String from;

    public EmailNotificationService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendSubscriptionExpirationWarning(Subscription subscription) {

        MimeMessagePreparator preparator = new MimeMessagePreparator() {
            @Override
            public void prepare(MimeMessage mimeMessage) throws Exception {
                User user = subscription.getUser();
                if (user != null) {
                    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

                    helper.setTo(new InternetAddress(user.getEmail()));
                    helper.setFrom(new InternetAddress(from));
                    helper.setSubject("Your " + subscription.getTitle() + " subscription is expiring in 2 days!");

                    String firstName = (user != null) ? user.getFirstName() : "Customer";

                    String formattedExpiryDate = "";
                    if (subscription.getExpiresAt() != null) {
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
                        formattedExpiryDate = subscription.getExpiresAt().format(formatter);
                    }

                    String htmlContent =
                            "<html>" +
                                    "<body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 20px;\">" +
                                    "<div style=\"max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; background-color: #ffffff;\">" +
                                    "<h2 style=\"color: #e53935; margin-top: 0;\">Your subscription is expiring soon!</h2>" +
                                    "<p>Dear " + firstName + ",</p>" +
                                    "<p>This is a quick reminder that your subscription for <strong>" + subscription.getTitle() + "</strong> is scheduled to expire in <strong>2 days</strong> on <strong>" + formattedExpiryDate + "</strong>.</p>" +

                                    "<div style=\"background-color: #f9f9f9; border-left: 4px solid #e53935; padding: 15px; margin: 20px 0; border-radius: 4px;\">" +
                                    "<p style=\"margin: 0;\"><strong>Subscription Details:</strong></p>" +
                                    "<p style=\"margin: 5px 0 0 0;\">Service: " + subscription.getTitle() + "</p>" +
                                    "<p style=\"margin: 5px 0 0 0;\">Price: $" + String.format("%.2f", subscription.getPrice()) + " / " + subscription.getCycle() + "</p>" +
                                    "</div>" +

                                    "<p>To ensure uninterrupted service and keep accessing your features, please renew your plan before " + formattedExpiryDate + ".</p>" +
                                    "<p>If you have any questions or believe this is an error, feel free to reply to this email.</p>" +
                                    "<br/>" +
                                    "<p style=\"margin-bottom: 0;\">Best regards,</p>" +
                                    "<p style=\"margin-top: 5px; font-weight: bold;\">The Outflow Team</p>" +
                                    "</div>" +
                                    "</body>" +
                                    "</html>";

                    helper.setText(htmlContent, true);
                }
                throw new NotFoundException("User that belongs to the subscription " + subscription.getTitle() + " not found");
            }
        };

        javaMailSender.send(preparator);
    }
}