public class ImprovedTransportService {
    public static void main(String[] args){
        //using factory to create objects
        Transport car = TransportFactory.createTransport("car");
        car.deliver();
        Transport bike = TransportFactory.createTransport("bike");
        bike.deliver();

        //new transport can be added without changing client code
        //Transport truck = TransportFactory.createTransport("truck");
    }
}
