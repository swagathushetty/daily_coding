
import java.util.ArrayList;

interface Observer {
    void update(float temp);
}

interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers();
}


class WeatherStation implements Subject {

    private float temperature;
    private ArrayList<Observer> observers;

    public WeatherStation() {
        this.observers = new ArrayList<>();
    }

    @Override
    public void attach(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void detach(Observer observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers() {
        for(Observer observer : observers){
            observer.update(temperature);
        }
    }

    public void setTemperature(float temperature) {
        this.temperature = temperature;
        notifyObservers();
    }


}

// ---------------------------------------------------------

class DisplayDevice implements Observer {
    @Override
    public void update(float temp) {
        System.out.println("Current temperature is: " + temp);
    }
}

class MobileApp implements Observer {
    @Override
    public void update(float temp) {
        System.out.println("Mobile App: Current temperature is: " + temp);
    }
}

public class ObserverPattern {
    
    public static void main(String[] args) {
        WeatherStation weatherStation = new WeatherStation();
        DisplayDevice displayDevice = new DisplayDevice();
        MobileApp mobileApp = new MobileApp();

        weatherStation.attach(displayDevice);
        weatherStation.attach(mobileApp);

        weatherStation.setTemperature(25.5f);
    }
}
