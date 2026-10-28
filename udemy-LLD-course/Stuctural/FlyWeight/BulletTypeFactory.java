import java.util.HashMap;


public class BulletTypeFactory {
    private static HashMap<String, BulletType> bulletTypeMap = new HashMap<>();

    public static BulletType getBulletType(String color){
        BulletType bulletType = bulletTypeMap.get(color);
        if(bulletType == null){
            bulletType = new BulletType(color);
            bulletTypeMap.put(color, bulletType);
        }
        return bulletType;  
    }
}
