package com.gwynejsn.model;

public record ExpiringSubscription(
        Subscription subscription,
        int noOfDaysLeft
){
}
