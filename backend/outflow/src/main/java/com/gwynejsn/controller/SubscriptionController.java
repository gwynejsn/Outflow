package com.gwynejsn.controller;

import com.gwynejsn.dto.SubscriptionCreateDto;
import com.gwynejsn.dto.SubscriptionDTO;
import com.gwynejsn.dto.SubscriptionUpdateDto;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.service.SubscriptionService;
import com.gwynejsn.utils.mappers.SubscriptionMapper;
import org.springframework.http.HttpStatus;
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
    public List<SubscriptionDTO> getAllSubscriptions() {
        return subscriptionService.getAllSubscriptions().stream()
                .map(SubscriptionMapper.INSTANCE::mapSubscriptionToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public SubscriptionDTO getSubscriptionById(@PathVariable("id") UUID id) {
        Subscription subscription = subscriptionService.getSubscriptionById(id);
        return SubscriptionMapper.INSTANCE.mapSubscriptionToDto(subscription);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public SubscriptionDTO createSubscription(@RequestBody SubscriptionCreateDto subscriptionCreateDto) {
        Subscription subscription = SubscriptionMapper.INSTANCE.mapDtoToSubscription(subscriptionCreateDto);
        subscription.setCreatedAt(LocalDateTime.now());

        Subscription saved = subscriptionService.saveSubscription(subscription);
        return SubscriptionMapper.INSTANCE.mapSubscriptionToDto(saved);
    }

    @PutMapping("/update")
    public SubscriptionDTO updateSubscription(@RequestBody SubscriptionUpdateDto subscriptionUpdateDto) {
        Subscription currentSubscription = subscriptionService.getSubscriptionById(subscriptionUpdateDto.id());

        SubscriptionMapper.INSTANCE.updateSubscriptionFromDto(subscriptionUpdateDto, currentSubscription);

        Subscription saved = subscriptionService.updateSubscription(subscriptionUpdateDto.id(), currentSubscription);
        return SubscriptionMapper.INSTANCE.mapSubscriptionToDto(saved);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteSubscription(@PathVariable("id") UUID id) {
        subscriptionService.deleteSubscription(id);
    }
}