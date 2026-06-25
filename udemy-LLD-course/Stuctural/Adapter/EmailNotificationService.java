

//legacy code
public class EmailNotificationService implements NotificationService {
    
    @Override
    public void send(String to, String subject,String body){
        System.out.println("Sending Email to "+ to);
        System.out.println("Subject is "+ subject);
        System.out.println("body is "+ body);
        System.out.println("Sent.......");
    }
}
