
public class Walking implements TransportationMode {

    @Override
    public int calcETA() {
        System.out.println("Calculating ETA for walking...");
        return 30; // ETA in minutes
    }

    @Override
    public String getDirection() {
        return "Directions for walking;";
    }
    
}
