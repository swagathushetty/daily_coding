

interface paymentStrategy {
    void processPayment();
}

class CreditCardPayment implements paymentStrategy {
    @Override
    public void processPayment() {
        System.out.println("Processing credit card payment");
    }
}

class DebitCardPayment implements paymentStrategy {
    @Override
    public void processPayment() {
        System.out.println("Processing debit card payment");
    }
}



// SEE WE ARE NOT CHANGING THE PAYMENT SERVICE CLASS BUT WE ARE ABLE TO ADD NEW PAYMENT METHODS WITHOUT CHANGING THE EXISTING CODE. THIS IS THE OPEN CLOSED PRINCIPLE IN ACTION.
class PaymentService2 {
    private paymentStrategy strategy;
    public void setPaymentStrategy(paymentStrategy strategy){
        this.strategy = strategy;
    }

    public void pay(){
            strategy.processPayment();
    }

}

class StratergyPattern {
    public static void main(String[] args) {
        PaymentService2 paymentService = new PaymentService2();
        paymentService.setPaymentStrategy(new CreditCardPayment());
        paymentService.pay();

        paymentService.setPaymentStrategy(new DebitCardPayment());
        paymentService.pay();
    }
}