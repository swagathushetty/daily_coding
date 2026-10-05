public class RealImage implements Image {
    
    private String filename;

    public RealImage(String filename){
        this.filename = filename;
        loadImageFromDisk(); //expensive operation
    }
    
    @Override
    public void display(){
        System.out.println("Displaying Image "+this.filename);
    }

    private void loadImageFromDisk(){
        System.out.println("Loading Image from disk");
    }
}
