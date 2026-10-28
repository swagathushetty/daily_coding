

public class Game {
    public static void main(String[] args){
        // 5 bullet objects
        for(int i=0; i<5; i++){
            Bullet bullet = new Bullet("Red", 10*i, 20*i, 30);
            bullet.display();
        }

        //5 Green bullet objects
        for(int i=0; i<5; i++){
            Bullet bullet = new Bullet("Green", 10*i, 20*i, 30);
            bullet.display();
        }
    }    
}
