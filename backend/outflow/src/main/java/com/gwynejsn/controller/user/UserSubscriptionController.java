package com.gwynejsn.controller.user;

import com.gwynejsn.dto.subscription.SubscriptionDTO;
import com.gwynejsn.dto.subscription.SubscriptionUpdateDto;
import com.gwynejsn.dto.subscription.UserSubscriptionCreateDto;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.model.User;
import com.gwynejsn.service.SubscriptionService;
import com.gwynejsn.service.UserService;
import com.gwynejsn.utils.mappers.SubscriptionMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/subscriptions")
public class UserSubscriptionController {
    private final SubscriptionService subscriptionService;
    private final UserService userService;

    public UserSubscriptionController(SubscriptionService subscriptionService, UserService userService) {
        this.subscriptionService = subscriptionService;
        this.userService = userService;
    }

    @GetMapping()
    public ResponseEntity<List<SubscriptionDTO>> getSubscriptions(HttpServletRequest request) {
        String currentEmail = request.getUserPrincipal().getName();
        User currentUser = userService.findByEmail(currentEmail);

        return ResponseEntity.ok(
                subscriptionService
                        .getSubscriptionsByUserId(currentUser.getId())
                        .stream().map(SubscriptionMapper.INSTANCE::mapSubscriptionToDto)
                        .collect(Collectors.toList())
        );
    }

    @PostMapping("/create")
    public ResponseEntity<SubscriptionDTO> createSubscription(
            @RequestBody UserSubscriptionCreateDto userSubscriptionCreateDto,
            HttpServletRequest request
    ) {
        String currentEmail = request.getUserPrincipal().getName();

        Subscription subscription = SubscriptionMapper.INSTANCE.mapUserDtoToSubscription(userSubscriptionCreateDto);

        Subscription saved = subscriptionService.saveSubscription(currentEmail, subscription);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(SubscriptionMapper.INSTANCE.mapSubscriptionToDto(saved));
    }

    @PutMapping("/update")
    public ResponseEntity<SubscriptionDTO> updateAccount(
            HttpServletRequest request,
            @RequestBody SubscriptionUpdateDto subscriptionUpdateDto
    ) {
        String currentEmail = request.getUserPrincipal().getName();
        User currentUser = userService.findByEmail(currentEmail);

        Subscription currentSubscription = subscriptionService.getSubscriptionByIdFromUserId(currentUser.getId(), subscriptionUpdateDto.id());

        SubscriptionMapper.INSTANCE.updateSubscriptionFromDto(subscriptionUpdateDto, currentSubscription);
        Subscription updatedSubscription = subscriptionService.updateSubscription(currentSubscription.getId(), currentSubscription);
        return ResponseEntity.ok(SubscriptionMapper.INSTANCE.mapSubscriptionToDto(updatedSubscription));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSubscription(
            HttpServletRequest request,
            @PathVariable("id") java.util.UUID id
    ) {
        String currentEmail = request.getUserPrincipal().getName();
        User currentUser = userService.findByEmail(currentEmail);

        Subscription currentSubscription = subscriptionService.getSubscriptionByIdFromUserId(currentUser.getId(), id);

        subscriptionService.deleteSubscription(currentSubscription.getId());
        return ResponseEntity.ok().build();
    }
}