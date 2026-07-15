package com.gwynejsn.utils;

import com.gwynejsn.dao.UserDao;
import com.gwynejsn.enums.Category;
import com.gwynejsn.enums.Cycle;
import com.gwynejsn.enums.Role;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.model.User;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Component
public class DataInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserDao userDao,
                           PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {

        userDao.deleteAll();

        User adminUser = new User(
                "admin",
                passwordEncoder.encode("admin123"),
                Role.ADMIN,
                "System",
                "Administrator",
                "admin@outflow.com",
                new ArrayList<>()
        );

        User studentUser = new User(
                "student",
                passwordEncoder.encode("student123"),
                Role.USER,
                "John",
                "Student",
                "student@outflow.com",
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
                LocalDateTime.now(),
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
                LocalDateTime.now().minusDays(5),
                LocalDateTime.now().plusDays(25)
        );

        netflix.setUser(studentUser);
        spotify.setUser(studentUser);

        studentUser.getSubscriptions().add(netflix);
        studentUser.getSubscriptions().add(spotify);

        userDao.save(adminUser);
        userDao.save(studentUser);

        System.out.println("\n🌱 [Outflow] Mock data seeded successfully!");
        System.out.println("👤 Admin username: admin");
        System.out.println("🔑 Admin password: admin123");
        System.out.println("👤 Student username: student");
        System.out.println("🔑 Student password: student123");
    }
}