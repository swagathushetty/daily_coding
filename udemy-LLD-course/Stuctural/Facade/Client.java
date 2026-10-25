
public class Client {
    public static void main(String[] args) {
        // UserService userService = new UserService();
        // OrderService orderService = new OrderService();
        // PaymentService paymentService = new PaymentService();

        // System.out.println(userService.getUserDetails());
        // System.out.println(orderService.getOrderDetails());
        // System.out.println(paymentService.processPayment());

        APIGateway gateway = new APIGateway();

        System.out.println(gateway.getFullDetails());
    }
}
