package com.gwynejsn.controller.user;

import com.gwynejsn.dto.notification.NotificationDto;
import com.gwynejsn.enums.ExpirationType;
import com.gwynejsn.model.Notification;
import com.gwynejsn.model.User;
import com.gwynejsn.service.InAppNotificationService;
import com.gwynejsn.service.UserService;
import com.gwynejsn.utils.mappers.NotificationMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user/notifications")
public class NotificationController {
    private final UserService userService;
    private final InAppNotificationService inAppNotificationService;

    public NotificationController(UserService userService, InAppNotificationService inAppNotificationService) {
        this.userService = userService;
        this.inAppNotificationService = inAppNotificationService;
    }

    @GetMapping()
    public ResponseEntity<List<NotificationDto>> getNotifications(
            HttpServletRequest request,
            @RequestParam(name = "expirationType", required = false) ExpirationType expirationType
            ) {
        String currentUsername = request.getUserPrincipal().getName();
        User user = userService.findByUsername(currentUsername);

        List<Notification> notifications;

        if (ExpirationType.EXPIRED.equals(expirationType)) {
            notifications = inAppNotificationService.getAllNotifications(user.getId(), ExpirationType.EXPIRED);
        } else if (ExpirationType.NEARING_EXPIRATION.equals(expirationType)) {
            notifications = inAppNotificationService.getAllNotifications(user.getId(), expirationType);
        } else {
            notifications = inAppNotificationService.getAllNotifications(user.getId());
        }

        return ResponseEntity.ok(
                notifications
                .stream().map(NotificationMapper.INSTANCE::notificationToNotificationDto)
                .collect(Collectors.toList())
        );
    }

    @GetMapping("/clear")
    public ResponseEntity<String> clearNotifications(HttpServletRequest request) {
        String currentUsername = request.getUserPrincipal().getName();
        User user = userService.findByUsername(currentUsername);

        inAppNotificationService.clearNotifications(user.getId());
        return ResponseEntity.ok("Notifications cleared.");
    }

}
