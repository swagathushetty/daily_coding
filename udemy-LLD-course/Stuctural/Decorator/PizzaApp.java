public class PizzaApp {
    
    public static void main(String[] args){
        Pizza pizza = new BasicPizza();

        //add cheese
        pizza = new CheeseDecorator(pizza);

        //add olives
        pizza = new OliveDecorator(pizza);


        System.out.println("The desc is -> "+pizza.getDescription());
        System.out.println("The cost is -> "+pizza.getCost());


        //adding mushroom
        pizza = new MushroomDecorator(pizza);

        System.out.println("The desc is -> "+pizza.getDescription());
        System.out.println("The cost is -> "+pizza.getCost());

    }
}
