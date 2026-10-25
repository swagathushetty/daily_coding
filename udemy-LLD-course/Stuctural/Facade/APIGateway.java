
public class APIGateway {
    private UserService userService;
    private PaymentService paymentService;
    private OrderService orderService;

    public APIGateway() {
        this.userService = new UserService();
        this.paymentService = new PaymentService();
        this.orderService = new OrderService();
    }

    public String getFullDetails() {
        return getUserDetails() + " | " + getOrderDetails() + " | " + getPaymentDetails();
    }
    public String getOrderDetails() {
        return orderService.getOrderDetails();
    }

    public String getUserDetails() {
        return userService.getUserDetails();
    }

    public String getPaymentDetails() {
        return paymentService.processPayment();
    }
}
