abstract public class PizzaDecorator implements Pizza {
    protected Pizza decoratedPizza;

    public PizzaDecorator(Pizza pizza){
        this.decoratedPizza = pizza;
    }

    @Override
    public String getDescription(){
        return this.decoratedPizza.getDescription();
    }

    @Override
    public double getCost(){
        return this.decoratedPizza.getCost();
    }
}
