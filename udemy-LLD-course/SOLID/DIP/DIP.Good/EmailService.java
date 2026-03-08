

public class EmailService implements NotificationChannel {

    // @Override
    public void send(String message){
        System.out.println("Email sent: " + message);
    }

    public static void main(String[] args) {
        EmailService emailService = new EmailService();
        emailService.send("Hello, this is a test email!");
    }

}