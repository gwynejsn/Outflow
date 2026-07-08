package com.gwynejsn;

import com.gwynejsn.config.AppConfig;
import com.gwynejsn.dao.SubscriptionDao;
import com.gwynejsn.enums.Category;
import com.gwynejsn.model.Subscription;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.time.LocalDateTime;

public class App
{
    public static void main( String[] args )
    {
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

        Subscription netflix = new Subscription(
                "Netflix Premium",
                "4K UHD Streaming plan with 4 concurrent screens.",
                14.99f,
                "https://example.com/images/netflix.png",
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
                Category.ENTERTAINMENT,
                LocalDateTime.now().minusMonths(6),
                LocalDateTime.now().minusDays(5),
                LocalDateTime.now().plusDays(25)
        );

        SubscriptionDao dao = context.getBean(SubscriptionDao.class);
        dao.save(netflix);
        dao.save(spotify);

        System.out.println("\n\n\n\n\nsaved mock data!!");

        // --- Corrected Printing Logic ---
        dao.findAll().stream()
                .map(sub -> "📍 Title: " + sub.getTitle() + " | Price: " + sub.getPrice())
                .forEach(System.out::println);

        System.out.println("\n\n\n\n\n");
    }
}