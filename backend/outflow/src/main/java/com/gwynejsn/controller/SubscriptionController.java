package com.gwynejsn.controller;

import com.gwynejsn.dao.SubscriptionDao;
import com.gwynejsn.dto.SubscriptionCreateDto;
import com.gwynejsn.dto.SubscriptionDTO;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.service.SubscriptionService;
import com.gwynejsn.utils.mappers.SubscriptionMapper;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping()
    public List<SubscriptionDTO> subscription() {
        return subscriptionService.getAllSubscriptions().stream().map(
                SubscriptionMapper.INSTANCE::mapSubscriptionToDto
        ).collect(Collectors.toList());
    }

    @PostMapping()
    public Subscription createSubscription(@RequestBody SubscriptionCreateDto subscriptionCreateDto) {
        Subscription subscription = SubscriptionMapper.INSTANCE.mapDtoToSubscription(subscriptionCreateDto);
        subscription.setCreatedAt(LocalDateTime.now());
        return subscriptionService.saveSubscription(subscription);
    }
}
