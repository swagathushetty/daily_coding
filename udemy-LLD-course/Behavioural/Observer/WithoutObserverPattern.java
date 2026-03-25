class DisplayDevice {
    public void showTemp(float temp){
        System.out.println("Current temperature is: " + temp);
    }
}


class WeatherStation {
    private float temperature;
    private DisplayDevice displayDevice; //can be muliple devices later on

    public WeatherStation(DisplayDevice displayDevice) {
        this.displayDevice = displayDevice;
    }

    public void setTemperature(float temperature) {
        this.temperature = temperature;
        notifyDevice();
    }

    public void notifyDevice(){
        displayDevice.showTemp(temperature);
    }
}



public class WithoutObserverPattern {
    
}
