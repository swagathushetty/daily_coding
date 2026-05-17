

enum TransportMode {
    WALKING,CYCLING,CAR,TRAIN
}
class DirectionService {

    private TransportMode mode;

    public DirectionService(TransportMode mode){
        this.mode = mode;
    }

    public void setMode(TransportMode mode){
        this.mode = mode;
    }

    //method to calculate ETA based on transportation mode
    public int getETA(){

        //we are violating OCP here because every time we want to 
        // add a new transport mode we have to modify this method
        switch(mode){
            case WALKING:
                System.out.println("Calculating ETA for walking...");
                return 30; // ETA in minutes
            case CYCLING:
                System.out.println("Calculating ETA for cycling...");
                return 15; // ETA in minutes
            case CAR:
                System.out.println("Calculating ETA for car...");   
                return 5;
            case TRAIN:
                System.out.println("Calculating ETA for train...");
                return 3;
            default:
                throw new IllegalStateException("Unknown transport mode: " + mode); 
        }
    }
}