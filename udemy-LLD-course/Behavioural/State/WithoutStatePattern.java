
public class WithoutStatePattern {
    public static void main(String[] args){
        DirectionService directionService = new DirectionService(TransportMode.WALKING);
        System.out.println("ETA: " + directionService.getETA() + " minutes");

        directionService.setMode(TransportMode.CYCLING);
        System.out.println("ETA: " + directionService.getETA() + " minutes");

        
    }
}
