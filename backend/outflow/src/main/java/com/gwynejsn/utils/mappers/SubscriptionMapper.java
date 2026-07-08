package com.gwynejsn.utils.mappers;

import com.gwynejsn.dto.SubscriptionCreateDto;
import com.gwynejsn.dto.SubscriptionDTO;
import com.gwynejsn.model.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SubscriptionMapper {
    SubscriptionMapper INSTANCE = Mappers.getMapper(SubscriptionMapper.class);

    SubscriptionDTO mapSubscriptionToDto(Subscription subscription);
    Subscription mapDtoToSubscription(SubscriptionCreateDto subscriptionCreateDto);
}
