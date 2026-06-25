


public class Client {
    public static void main(String[] args){
        NotificationService emailService = new EmailNotificationService();
        emailService.send("abc@bbc.com","Hi mon","this is a test message");

        NotificationService emailService2 = new SendGridAdapter(new SendGridService());
        emailService2.send("abc@bbc.com", "yo", "hello guys");
    }
}
