package Creational.Builder.Problem;
public class House {

    private String foundation;
    private String structure;
    private String roof;
    private boolean hasGarage;
    private boolean hasGarden;


    //bad because
    //1. Too many parameters, hard to remember the order(constructor explosion)
    //2. Not all houses will have garage and garden, so we need to pass false for those parameters
    //3. If we want to add more features in the future, we need to change
    // the constructor and all the places where we are creating house objects
    public House(String foundation, String structure, String roof, boolean hasGarage, boolean hasGarden) {
        this.foundation = foundation;
        this.structure = structure;
        this.roof = roof;
        this.hasGarage = hasGarage;
        this.hasGarden = hasGarden;
    }

    @Override
    public String toString() {
        return "House{" +
                "foundation='" + foundation + '\'' +
                ", structure='" + structure + '\'' +
                ", roof='" + roof + '\'' +
                ", hasGarage=" + hasGarage +
                ", hasGarden=" + hasGarden +
                '}';
    }

    public static void main(String[] args) {
        House house1 = new House("Concrete", "Brick", "Tile", true, true);
        House house2 = new House("Wood", "Wood", "Shingle", false, false);
        System.out.println(house1);
        System.out.println(house2);
    }
}
