


//also called the flyweight class
public class BulletType {
     //intrinsic state aka shared state aka all bullets will share the same color
    private final String color;
    
    public BulletType(String color) {
        this.color = color;
    }
    
    public String getColor() {
        return color;
    }
}
