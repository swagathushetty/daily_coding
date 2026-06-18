package Creational.Builder.Solution;

public class WithBuilder {
    public static void main(String[] args){
        House house = new House.HouseBuilder("Concrete", "Brick", "Tile")
                .setHasGarage(true)
                .setHasGarden(true)
                .build();

        System.out.println(house);
    }
}
