package com.gwynejsn.utils.mappers;

import com.gwynejsn.dto.SubscriptionCreateDto;
import com.gwynejsn.dto.UserCreateDto;
import com.gwynejsn.dto.UserDto;
import com.gwynejsn.model.Subscription;
import com.gwynejsn.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDto mapUserToDto(User user);
    User mapCreateUserDtoToUser(UserCreateDto userCreateDto);
}
