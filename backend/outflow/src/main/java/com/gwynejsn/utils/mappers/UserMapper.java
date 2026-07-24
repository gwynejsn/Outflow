package com.gwynejsn.utils.mappers;

import com.gwynejsn.dto.user.UserCreateDto;
import com.gwynejsn.dto.user.UserDto;
import com.gwynejsn.dto.user.UserUpdateDto;
import com.gwynejsn.model.User;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDto mapUserToDto(User user);
    User mapCreateUserDtoToUser(UserCreateDto userCreateDto);
    @Mapping(target = "id", ignore = true) // Protect the primary key from being overwritten
    @Mapping(target = "password", ignore = true) // Handle password updates separately to prevent double-hashing
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromDto(UserUpdateDto userUpdateDto,@MappingTarget User currentUser);
}
