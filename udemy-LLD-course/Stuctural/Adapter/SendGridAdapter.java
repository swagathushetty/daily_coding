
public class SendGridAdapter implements NotificationService {

    private SendGridService sendGridInstance;

    public SendGridAdapter(SendGridService service){
        this.sendGridInstance = service;
    }
    
    @Override
    public void send(String to,String subject,String body){
        this.sendGridInstance.sendEmail(to, subject, body);
    }
}
