
public class Cycling implements TransportationMode {

    @Override
    public int calcETA() {
        System.out.println("Calculating ETA for cycling...");
        return 15; // ETA in minutes
    }

    @Override
    public String getDirection() {
        return "Directions for cycling;";
    }

}