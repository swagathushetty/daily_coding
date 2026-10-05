public class MushroomDecorator extends PizzaDecorator {
    public MushroomDecorator(Pizza pizza){
        super(pizza);
    }

    @Override
    public String getDescription(){
        return decoratedPizza.getDescription() + "Mushroom";
    }

    @Override
    public double getCost(){
        return decoratedPizza.getCost() + 0.5;
    }
}
