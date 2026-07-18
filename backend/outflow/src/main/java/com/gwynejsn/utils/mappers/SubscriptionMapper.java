package com.gwynejsn.utils.mappers;

import com.gwynejsn.dto.subscription.SubscriptionCreateDto;
import com.gwynejsn.dto.subscription.SubscriptionDTO;
import com.gwynejsn.dto.subscription.SubscriptionUpdateDto;
import com.gwynejsn.model.Subscription;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SubscriptionMapper {
    SubscriptionMapper INSTANCE = Mappers.getMapper(SubscriptionMapper.class);

    SubscriptionDTO mapSubscriptionToDto(Subscription subscription);
    Subscription mapDtoToSubscription(SubscriptionCreateDto subscriptionCreateDto);
    @Mapping(target = "id", ignore = true) // Protect the primary key from being overwritten
    // updating the subscription with values from the dto ignoring the null values
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateSubscriptionFromDto(SubscriptionUpdateDto dto, @MappingTarget Subscription subscription);
}
