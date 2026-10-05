public class ProxyImage implements Image {
    
    final private String filename;

    private RealImage realImage;

    public ProxyImage(String filename){
        this.filename = filename;
    }
    
    @Override
    public void display(){

        //lazy loading
        if(realImage == null){
            realImage = new RealImage(filename);
        }
        
        realImage.display();
    }
}
