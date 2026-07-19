package com.gwynejsn.utils.mappers;

import com.gwynejsn.dto.notification.NotificationDto;
import com.gwynejsn.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {
    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    @Mapping(target = "subscriptionId", source = "subscription.id")
    NotificationDto notificationToNotificationDto(Notification notification);
}
