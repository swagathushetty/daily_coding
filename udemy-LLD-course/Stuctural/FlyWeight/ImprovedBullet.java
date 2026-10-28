
public class ImprovedBullet {

    private BulletType bulletType; // reference to the flyweight class
    //extrinsic state aka each bullet has its own unique state
    private int x, y;
    private int velocity;
    
    public ImprovedBullet(String color, int x, int y, int velocity) {

        //this saves us lot of memory as we are not creating new BulletType object for each bullet, instead we are reusing the existing one
        this.bulletType = BulletTypeFactory.getBulletType(color);
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }

    public void display() {
        System.out.println("Bullet is moving at (" + x + ", " + y + ") with velocity " + velocity + " and color " + bulletType.getColor());
    }
}
