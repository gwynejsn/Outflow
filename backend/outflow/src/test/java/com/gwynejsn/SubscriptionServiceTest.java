//package com.gwynejsn;
//
//import com.gwynejsn.dao.SubscriptionDao;
//import com.gwynejsn.enums.Category;
//import com.gwynejsn.enums.Cycle;
//import com.gwynejsn.exception.AlreadyExistException;
//import com.gwynejsn.exception.NotFoundException;
//import com.gwynejsn.model.Subscription;
//import com.gwynejsn.model.User;
//import com.gwynejsn.service.SubscriptionService;
//import com.gwynejsn.service.UserService;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//public class SubscriptionServiceTest {
//
//    @Mock
//    private SubscriptionDao subscriptionDao;
//
//    @Mock
//    private UserService userService;
//
//    @InjectMocks
//    private SubscriptionService subscriptionService;
//
//    private Subscription createTestSubscription(UUID id) {
//        Subscription subscription = new Subscription(
//                "Netflix Premium",
//                "4K UHD Streaming plan with 4 concurrent screens.",
//                14.99f,
//                "https://example.com/images/netflix.png",
//                Cycle.MONTHLY,
//                Category.ENTERTAINMENT,
//                LocalDateTime.now().minusMonths(3),
//                LocalDateTime.now().plusMonths(1)
//        );
//        if (id != null) subscription.setId(id);
//        return subscription;
//    }
//
//    private User createTestUser(String email) {
//        User user = new User();
//        user.setEmail(email);
//        user.setSubscriptions(new ArrayList<>());
//        return user;
//    }
//
//    @Test
//    @DisplayName("GIVEN subscriptions exist WHEN getAllSubscriptions is called THEN return list of subscriptions")
//    void getAllSubscriptions_ShouldReturnList() {
//        Subscription sub = createTestSubscription(UUID.randomUUID());
//        when(subscriptionDao.findAll()).thenReturn(List.of(sub));
//
//        List<Subscription> result = subscriptionService.getAllSubscriptions();
//
//        assertNotNull(result);
//        assertEquals(1, result.size());
//        verify(subscriptionDao, times(1)).findAll();
//    }
//
//    @Test
//    @DisplayName("GIVEN existing UUID WHEN getSubscriptionById is called THEN return matching subscription")
//    void getSubscriptionById_WhenExists_ShouldReturnSubscription() {
//        UUID id = UUID.randomUUID();
//        Subscription sub = createTestSubscription(id);
//        when(subscriptionDao.findById(id)).thenReturn(Optional.of(sub));
//
//        Subscription result = subscriptionService.getSubscriptionById(id);
//
//        assertNotNull(result);
//        assertEquals(id, result.getId());
//        verify(subscriptionDao, times(1)).findById(id);
//    }
//
//    @Test
//    @DisplayName("GIVEN non-existent UUID WHEN getSubscriptionById is called THEN throw NotFoundException")
//    void getSubscriptionById_WhenNotExists_ShouldThrowNotFoundException() {
//        UUID id = UUID.randomUUID();
//        when(subscriptionDao.findById(id)).thenReturn(Optional.empty());
//
//        assertThrows(NotFoundException.class, () -> subscriptionService.getSubscriptionById(id));
//        verify(subscriptionDao, times(1)).findById(id);
//    }
//
//    @Test
//    @DisplayName("""
//            GIVEN: Subscription exist in the database
//            WHEN: saveSubscription is called
//            THEN: Subscription not saved
//            AND: an Already exist exception is thrown
//            """)
//    public void saveSubscription_WhenAlreadyExists_ShouldThrowAlreadyExistException() {
//        String username = "test@outflow.com";
//        User mockUser = createTestUser(username);
//        Subscription subscription = createTestSubscription(UUID.randomUUID());
//
//        when(userService.findByEmail(username)).thenReturn(mockUser);
//        when(subscriptionDao.existsById(subscription.getId())).thenReturn(true);
//
//        assertThrows(AlreadyExistException.class, () -> subscriptionService.saveSubscription(username, subscription));
//
//        verify(subscriptionDao, times(1)).existsById(subscription.getId());
//        verify(subscriptionDao, never()).save(any(Subscription.class));
//    }
//
//    @Test
//    @DisplayName("""
//            GIVEN: User does not exist in the database
//            WHEN: saveSubscription is called
//            THEN: Subscription is not saved
//            AND: a NotFoundException is thrown
//            """)
//    public void saveSubscription_WhenUserDoesNotExist_ShouldThrowNotFoundException() {
//        String username = "nonexistent@outflow.com";
//        Subscription subscription = createTestSubscription(UUID.randomUUID());
//
//        when(userService.findByEmail(username)).thenThrow(new NotFoundException("User not found"));
//
//        assertThrows(NotFoundException.class, () -> subscriptionService.saveSubscription(username, subscription));
//
//        verify(subscriptionDao, never()).save(any(Subscription.class));
//    }
//
//    @Test
//    @DisplayName("""
//            GIVEN: Subscription does not exist in the database
//            WHEN: saveSubscription is called
//            THEN: Subscription is saved
//            AND: no exception is thrown
//            """)
//    public void saveSubscription_WhenDoesNotExist_ShouldSaveSuccessfully() {
//        String username = "test@outflow.com";
//        User mockUser = createTestUser(username);
//        UUID subscriptionId = UUID.randomUUID();
//        Subscription subscriptionToBeSaved = createTestSubscription(subscriptionId);
//        Subscription mockSavedResult = createTestSubscription(subscriptionId);
//
//        when(userService.findByEmail(username)).thenReturn(mockUser);
//        when(subscriptionDao.existsById(subscriptionId)).thenReturn(false);
//        when(subscriptionDao.save(subscriptionToBeSaved)).thenReturn(mockSavedResult);
//
//        Subscription result = subscriptionService.saveSubscription(username, subscriptionToBeSaved);
//
//        assertNotNull(result);
//        assertEquals(subscriptionId, result.getId());
//        verify(subscriptionDao, times(1)).save(subscriptionToBeSaved);
//    }
//
//    @Test
//    @DisplayName("""
//            GIVEN: UUID and an updated Subscription and the Subscription with the UUID does not exist
//            WHEN: updateSubscription is called
//            THEN: Subscription is not updated
//            AND: a Not found exception is thrown
//            """)
//    public void updateSubscription_WhenDoesNotExist_ShouldThrowNotFoundException() {
//        Subscription subscription = createTestSubscription(UUID.randomUUID());
//        when(subscriptionDao.existsById(subscription.getId())).thenReturn(false);
//
//        assertThrows(NotFoundException.class, () -> subscriptionService.updateSubscription(subscription.getId(), subscription));
//
//        verify(subscriptionDao, times(1)).existsById(subscription.getId());
//        verify(subscriptionDao, never()).save(any(Subscription.class));
//    }
//
//    @Test
//    @DisplayName("""
//            GIVEN: UUID and an updated Subscription and the Subscription with the UUID exist
//            WHEN: updateSubscription is called
//            THEN: Subscription is updated
//            AND: no exception is thrown
//            """)
//    public void updateSubscription_WhenExists_ShouldUpdateSuccessfully() {
//        UUID subscriptionId = UUID.randomUUID();
//        Subscription updatedSubscription = createTestSubscription(subscriptionId);
//        Subscription mockUpdatedSubscription = createTestSubscription(subscriptionId);
//
//        when(subscriptionDao.existsById(subscriptionId)).thenReturn(true);
//        when(subscriptionDao.save(updatedSubscription)).thenReturn(mockUpdatedSubscription);
//
//        Subscription result = subscriptionService.updateSubscription(subscriptionId, updatedSubscription);
//
//        assertNotNull(result);
//        assertEquals(subscriptionId, result.getId());
//        verify(subscriptionDao, times(1)).save(updatedSubscription);
//    }
//
//    @Test
//    @DisplayName("""
//            GIVEN: UUID of subscription to delete and it doesn't exist
//            WHEN: deleteSubscription is called
//            THEN: Subscription is not deleted
//            AND: a Not Found exception is thrown
//            """)
//    public void deleteSubscription_WhenDoesNotExist_ShouldThrowNotFoundException() {
//        UUID subscriptionId = UUID.randomUUID();
//        when(subscriptionDao.existsById(subscriptionId)).thenReturn(false);
//
//        assertThrows(NotFoundException.class, () -> subscriptionService.deleteSubscription(subscriptionId));
//
//        verify(subscriptionDao, times(1)).existsById(subscriptionId);
//        verify(subscriptionDao, never()).deleteById(any(UUID.class));
//    }
//
//    @Test
//    @DisplayName("""
//            GIVEN: UUID of subscription to delete and it exist
//            WHEN: deleteSubscription is called
//            THEN: Subscription is deleted
//            AND: no exception is thrown
//            """)
//    public void deleteSubscription_WhenExists_ShouldDeleteSuccessfully() {
//        UUID subscriptionId = UUID.randomUUID();
//        when(subscriptionDao.existsById(subscriptionId)).thenReturn(true);
//
//        assertDoesNotThrow(() -> subscriptionService.deleteSubscription(subscriptionId));
//
//        verify(subscriptionDao, times(1)).deleteById(subscriptionId);
//    }
//}