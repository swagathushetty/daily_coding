
public class Bullet {

    //intrinsic state aka shared state aka all bullets will share the same color
    private String color;
    
    //extrinsic state aka each bullet has its own unique state
    private int x, y;
    private int velocity;
    
    public Bullet(String color, int x, int y, int velocity) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }

    public void display() {
        System.out.println("Bullet is moving at (" + x + ", " + y + ") with velocity " + velocity);
    }
}
