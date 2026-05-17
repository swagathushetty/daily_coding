
public class WithStatepattern {
    
    public static void main(String[] args){
        NewDirectionService directionService = new NewDirectionService(new Walking());
        System.out.println("ETA: " + directionService.getETA() + " minutes");
        System.out.println(directionService.getDirection());

        directionService.setTransportationMode(new Cycling());
        System.out.println("ETA: " + directionService.getETA() + " minutes");
        System.out.println(directionService.getDirection());
    }
}
