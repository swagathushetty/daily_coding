public class Main {
    public static void main(String[] args) {
        // Using EmailService
        NotificationChannel emailChannel = new EmailService();
        NotificationService emailNotificationService = new NotificationService(emailChannel);
        emailNotificationService.sendNotification("Hello, this is a test email!");

        // Using SMSService
        NotificationChannel smsChannel = new SMSService();
        NotificationService smsNotificationService = new NotificationService(smsChannel);
        smsNotificationService.sendNotification("Hello, this is a test SMS!");
    }
}
