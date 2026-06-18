package tools;



// this is actually a class behind the scene
enum Status {
    //these are 4 objects of Status class
    //these are indexed from 0..
    Running, Failed, Pending, Success
}


enum Laptop {
    Macbook(1000), Dell(800), HP(600), Thinkpad(900), Surface;

    //why private ?
    //java restricton ?
    //yes, java restricts us to create any other object of Laptop enum
    private int price;

    //why private constructor ?
    //because we don't want to create any other object of Laptop enum
    //restriction set by java ? 
    //yes, java restricts us to create any other object of Laptop enum
    private Laptop(int price) {
        this.price = price;
    }

    // this for case like Surface 
    //where we are not calling the constructor
    //we then call the default in that case
    private Laptop() {
        this.price = 0;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}

public class Enums {
    
    public static void main(String[] args) {
        System.out.println("Enums");


        Status s = Status.Pending;
        System.out.println(s.getClass().getSuperclass()); //returnd java.lang.Enum

        System.out.println(s);

        // Status[] allStatus = Status.values();
        // for (Status status : allStatus) {
        //     System.out.println(status);
        // }

        switch(s){
            case Running:
                System.out.println("Status is Running");
                break;
            case Failed:
                System.out.println("Status is Failed");
                break;
            case Pending:
                System.out.println("Status is Pending");
                break;
            case Success:
                System.out.println("Status is Success");
                break;
        }


        Laptop l = Laptop.Dell;
        System.out.println(l);
        System.out.println(l.getPrice());
    }
}



