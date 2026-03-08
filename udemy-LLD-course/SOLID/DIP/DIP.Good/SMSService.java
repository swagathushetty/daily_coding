
public class SMSService implements NotificationChannel {

    // @Override
    public void send(String message){
        System.out.println("SMS sent: " + message);
    }

    public static void main(String[] args) {
        SMSService smsService = new SMSService();
        smsService.send("Hello, this is a test SMS!");
    }

}