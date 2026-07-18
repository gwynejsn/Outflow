package com.gwynejsn.utils.mappers;

import com.gwynejsn.dto.subscription.SubscriptionCreateDto;
import com.gwynejsn.dto.subscription.SubscriptionDTO;
import com.gwynejsn.dto.subscription.SubscriptionUpdateDto;
import com.gwynejsn.dto.subscription.UserSubscriptionCreateDto;
import com.gwynejsn.model.Subscription;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SubscriptionMapper {
    SubscriptionMapper INSTANCE = Mappers.getMapper(SubscriptionMapper.class);

    SubscriptionDTO mapSubscriptionToDto(Subscription subscription);
    @Mapping(target = "user", ignore = true) // the username is for specifying the user we are adding this subscription to
    Subscription mapDtoToSubscription(SubscriptionCreateDto subscriptionCreateDto);
    Subscription mapUserDtoToSubscription(UserSubscriptionCreateDto userSubscriptionCreateDto);
    @Mapping(target = "id", ignore = true) // Protect the primary key from being overwritten
    // updating the subscription with values from the dto ignoring the null values
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateSubscriptionFromDto(SubscriptionUpdateDto dto, @MappingTarget Subscription subscription);
}
