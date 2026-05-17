
public class NewDirectionService {
    TransportationMode transportationMode;
    
    public NewDirectionService(TransportationMode transportationMode) {
        this.transportationMode = transportationMode;
    }

    public void setTransportationMode(TransportationMode transportationMode) {
        this.transportationMode = transportationMode;
    }

    public int getETA() {
        return transportationMode.calcETA();
    }

    public String getDirection() {
        return transportationMode.getDirection();
    }
}
