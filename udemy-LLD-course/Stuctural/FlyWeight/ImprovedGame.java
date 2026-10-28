
public class ImprovedGame {
    public static void main(String[] args){
        // 5 bullet objects
        for(int i=0; i<5; i++){
            ImprovedBullet bullet = new ImprovedBullet("Red", 10*i, 20*i, 30);
            bullet.display();
        }

        //5 Green bullet objects
        for(int i=0; i<5; i++){
            ImprovedBullet bullet = new ImprovedBullet("Green", 10*i, 20*i, 30);
            bullet.display();
        }
    }
}
