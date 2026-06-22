package udemy-LLD-course.Creational.Prototype.problem;

public class Gamepiece {
    private String color;

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    private int position;

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }


    public Gamepiece(String color, int position) {
        this.color = color;
        this.position = position;
    }

    @Override
    public String toString() {
        return "Gamepiece{" +
                "color='" + color + '\'' +
                ", position=" + position +
                '}';
    }
    
}
