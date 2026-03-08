public class NotificationService {
    private NotificationChannel notificationChannel;
    
    public NotificationService(NotificationChannel notificationChannel) {
        this.notificationChannel = notificationChannel;
    }
    
    public void sendNotification(String message) {
        notificationChannel.send(message);
    }

}
