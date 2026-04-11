


class PaymentService {
    public void processPayment(String paymentMethod){
        if(paymentMethod.equals("CreditCard")){
            System.out.println("Processing credit card payment");
        } else if(paymentMethod.equals("PayPal")){
            System.out.println("Processing PayPal payment");
        } else {
            System.out.println("Invalid payment method");
        }
    }
}

public class WithoutStatergy {
    public static void main(String[] args){
        PaymentService paymentService = new PaymentService();
        paymentService.processPayment("PayPal");
        paymentService.processPayment("CreditCard");
    }
}
