package com.gwynejsn.controller;

import com.gwynejsn.dto.SubscriptionCreateDto;
import com.gwynejsn.dto.SubscriptionDTO;
import com.gwynejsn.dto.SubscriptionUpdateDto;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.service.SubscriptionService;
import com.gwynejsn.utils.mappers.SubscriptionMapper;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
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

    @GetMapping("/{id}")
    public SubscriptionDTO subscription(@PathVariable("id") UUID id) {
        System.out.println("ID received: " + id);
        return SubscriptionMapper.INSTANCE.mapSubscriptionToDto(subscriptionService.getSubscriptionById(id));
    }

    @PostMapping("/create")
    public SubscriptionDTO createSubscription(@RequestBody SubscriptionCreateDto subscriptionCreateDto) {
        Subscription subscription = SubscriptionMapper.INSTANCE.mapDtoToSubscription(subscriptionCreateDto);
        subscription.setCreatedAt(LocalDateTime.now());
        return SubscriptionMapper.INSTANCE.mapSubscriptionToDto(subscriptionService.saveSubscription(subscription));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteSubscription(@PathVariable("id") UUID id) {
        subscriptionService.deleteSubscription(id);
    }

    @PutMapping("/update")
    public SubscriptionDTO updateSubscription(@RequestBody SubscriptionUpdateDto subscriptionUpdateDto) {
        Subscription updatedSubscription = subscriptionService.getSubscriptionById(subscriptionUpdateDto.id());
        SubscriptionMapper.INSTANCE.updateSubscriptionFromDto(subscriptionUpdateDto, updatedSubscription);
        return SubscriptionMapper.INSTANCE.mapSubscriptionToDto(subscriptionService.saveSubscription(updatedSubscription));
    }
}
