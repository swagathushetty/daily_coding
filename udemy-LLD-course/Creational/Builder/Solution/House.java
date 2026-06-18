package Creational.Builder.Solution;


public class House {

    private String foundation;
    private String structure;
    private String roof;
    private boolean hasGarage;
    private boolean hasGarden;


    //only HouseBuilder can create House objects
    private House(HouseBuilder builder) {
        this.foundation = builder.foundation;
        this.structure = builder.structure;
        this.roof = builder.roof;
        this.hasGarage = builder.hasGarage;
        this.hasGarden = builder.hasGarden;
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
        House house1 = new House(new HouseBuilder("Concrete", "Brick", "Tile").setHasGarage(true).setHasGarden(true));
        House house2 = new House(new HouseBuilder("Wood", "Wood", "Shingle").setHasGarage(false).setHasGarden(false));
        System.out.println(house1);
        System.out.println(house2);
    }

    public static class HouseBuilder {
        private String foundation;
        private String structure;
        private String roof;
        private boolean hasGarage;
        private boolean hasGarden;
        
        //required parameters
        public HouseBuilder(String foundation, String structure, String roof) {
            this.foundation = foundation;
            this.structure = structure;
            this.roof = roof;
        }

        //optional parameters
        public HouseBuilder setHasGarage(boolean hasGarage) {
            this.hasGarage = hasGarage;
            return this;
        }

        public HouseBuilder setHasGarden(boolean hasGarden) {
            this.hasGarden = hasGarden;
            return this;
        }

        public House build() {
            return new House(this);
        }
    }
}
