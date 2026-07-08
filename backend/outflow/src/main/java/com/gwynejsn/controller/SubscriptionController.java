package com.gwynejsn.controller;

import com.gwynejsn.dao.SubscriptionDao;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.service.SubscriptionService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/subscriptions")
    public List<Subscription> subscription() {
        return subscriptionService.getAllSubscriptions();
    }
}
