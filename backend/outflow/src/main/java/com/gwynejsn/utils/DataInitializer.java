package com.gwynejsn.utils;

import com.gwynejsn.dao.UserDao;
import com.gwynejsn.enums.Category;
import com.gwynejsn.enums.Cycle;
import com.gwynejsn.enums.ExpirationType;
import com.gwynejsn.enums.Role;
import com.gwynejsn.model.Notification;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.model.User;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private boolean alreadySeeded = false;

    public DataInitializer(UserDao userDao,
                           PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        // Prevent re-running on nested context refreshes
        if (alreadySeeded || event.getApplicationContext().getParent() != null) {
            return;
        }

        // Delete Admin User if exists
        Optional.ofNullable(userDao.findByEmail("admin@outflow.com"))
                .ifPresent(userDao::delete);

        // Delete Student User if exists (deletes associated subscriptions & notifications via cascade)
        Optional.ofNullable(userDao.findByEmail("student@outflow.com"))
                .ifPresent(userDao::delete);

        // Re-create Admin User
        User adminUser = new User(
                passwordEncoder.encode("admin123"),
                Role.ADMIN,
                "System",
                "Administrator",
                "admin@outflow.com",
                new ArrayList<>(),
                new ArrayList<>()
        );

        // Re-create Student User
        User studentUser = new User(
                passwordEncoder.encode("student123"),
                Role.USER,
                "John",
                "Student",
                "student@outflow.com",
                new ArrayList<>(),
                new ArrayList<>()
        );

        Subscription netflix = new Subscription(
                "Netflix Premium",
                "4K UHD Streaming plan with 4 concurrent screens.",
                14.99f,
                "https://example.com/images/netflix.png",
                Cycle.MONTHLY,
                Category.ENTERTAINMENT,
                LocalDateTime.now().minusMonths(3),
                LocalDateTime.now().plusMonths(1)
        );

        Subscription spotify = new Subscription(
                "Spotify Premium Duo",
                "Ad-free music streaming for two accounts.",
                149.00f,
                "https://example.com/images/spotify.png",
                Cycle.WEEKLY,
                Category.ENTERTAINMENT,
                LocalDateTime.now().minusMonths(6),
                LocalDateTime.now().plusDays(25)
        );

        Subscription spotifyNearExpired = new Subscription(
                "Spotify Premium Duo",
                "Ad-free music streaming for two accounts.",
                149.00f,
                "https://example.com/images/spotify.png",
                Cycle.WEEKLY,
                Category.ENTERTAINMENT,
                LocalDateTime.now().minusDays(5),
                LocalDateTime.now().plusDays(2)
        );

        Notification netflixNotification = new Notification(
                ExpirationType.NEARING_EXPIRATION,
                "Your Netflix Premium subscription renewed successfully.",
                studentUser,
                netflix
        );

        Notification spotifyNotification = new Notification(
                ExpirationType.EXPIRED,
                "Warning: Your Spotify Premium Duo subscription is expiring in 2 days!",
                studentUser,
                spotify
        );

        netflix.setUser(studentUser);
        spotify.setUser(studentUser);
        spotifyNearExpired.setUser(studentUser);

        studentUser.getSubscriptions().add(netflix);
        studentUser.getSubscriptions().add(spotify);
        studentUser.getSubscriptions().add(spotifyNearExpired);

        studentUser.setNotifications(List.of(netflixNotification, spotifyNotification));

        userDao.save(adminUser);
        userDao.save(studentUser);

        alreadySeeded = true;

        System.out.println("\n🌱 [Outflow] Mock data seeded successfully!");
        System.out.println("👤 Admin username: admin@outflow.com");
        System.out.println("🔑 Admin password: admin123");
        System.out.println("👤 Student username: student@outflow.com");
        System.out.println("🔑 Student password: student123");
    }
}