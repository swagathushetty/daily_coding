public class Client {
    

    public static void main(String[] args){
        // Image img = new RealImage("abc.png");
        // Image img2 = new RealImage("abc.png"); //expensive


        // img.display();
        // img2.display(); //should ideally lazy load since expensive


        Image img3 = new ProxyImage("abc.png");
        Image img4 = new ProxyImage("abc.png");

        
        //only loaded when gets called
        img3.display();
        img4.display();
    }
}
