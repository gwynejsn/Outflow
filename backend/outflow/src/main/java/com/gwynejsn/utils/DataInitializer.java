package com.gwynejsn.utils;

import com.gwynejsn.dao.SubscriptionDao;
import com.gwynejsn.enums.Category;
import com.gwynejsn.enums.Cycle;
import com.gwynejsn.model.Subscription;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private final SubscriptionDao dao;

    public DataInitializer(SubscriptionDao dao) {
        this.dao = dao;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        // Prevent executing twice if there are root/child contexts
        dao.deleteAll();

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

        dao.save(netflix);
        dao.save(spotify);

        System.out.println("\n\n🌱 [Outflow] Mock data seeded successfully!");
        dao.findAll().forEach(sub -> System.out.println("📍 Title: " + sub.getTitle()));
        System.out.println("\n");
    }
}