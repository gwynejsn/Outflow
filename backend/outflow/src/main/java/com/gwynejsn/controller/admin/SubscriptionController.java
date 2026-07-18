package com.gwynejsn.controller.admin;

import com.gwynejsn.dto.subscription.SubscriptionCreateDto;
import com.gwynejsn.dto.subscription.SubscriptionDTO;
import com.gwynejsn.dto.subscription.SubscriptionUpdateDto;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.service.SubscriptionService;
import com.gwynejsn.utils.mappers.SubscriptionMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Admin can manage any subscriptions
 */

@RestController
@RequestMapping("/admin/subscriptions")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping()
    public ResponseEntity<List<SubscriptionDTO>> getAllSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions().stream()
                .map(SubscriptionMapper.INSTANCE::mapSubscriptionToDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionDTO> getSubscriptionById(@PathVariable("id") UUID id) {
        Subscription subscription = subscriptionService.getSubscriptionById(id);
        return ResponseEntity.ok(SubscriptionMapper.INSTANCE.mapSubscriptionToDto(subscription));
    }

    @PostMapping("/create")
    public ResponseEntity<SubscriptionDTO> createSubscription(@RequestBody SubscriptionCreateDto subscriptionCreateDto) {
        Subscription subscription = SubscriptionMapper.INSTANCE.mapDtoToSubscription(subscriptionCreateDto);

        Subscription saved = subscriptionService.saveSubscription(subscriptionCreateDto.username(), subscription);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(SubscriptionMapper.INSTANCE.mapSubscriptionToDto(saved));
    }

    @PutMapping("/update")
    public ResponseEntity<SubscriptionDTO> updateSubscription(@RequestBody SubscriptionUpdateDto subscriptionUpdateDto) {
        Subscription currentSubscription = subscriptionService.getSubscriptionById(subscriptionUpdateDto.id());

        SubscriptionMapper.INSTANCE.updateSubscriptionFromDto(subscriptionUpdateDto, currentSubscription);

        Subscription saved = subscriptionService.updateSubscription(subscriptionUpdateDto.id(), currentSubscription);
        return ResponseEntity.ok(SubscriptionMapper.INSTANCE.mapSubscriptionToDto(saved));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteSubscription(@PathVariable("id") UUID id) {
        subscriptionService.deleteSubscription(id);
    }
}