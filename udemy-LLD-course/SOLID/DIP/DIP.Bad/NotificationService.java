

public class NotificationService {
    private SMSService smsService;
    private EmailService emailService;

    public NotificationService() {
        this.smsService = new SMSService();
        this.emailService = new EmailService();
    }

    public void notifyByEmail(String message) {
        emailService.SendEmail(message);
    }

    public void notifyBySMS(String message) {
        smsService.SendSMS(message);
    }
}