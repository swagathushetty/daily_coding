
public class AppSettings2 {

    private static AppSettings2 instance;

    private String databaseUrl;
    private String apiKey;

    private AppSettings2(){
        //read settings from a config file
        databaseUrl = "jdbc:mysql://localhost:3306/mydb";
        apiKey = "1234567890";
    }

    public static AppSettings2 getInstance() {
        if (instance == null) {
            instance = new AppSettings2();
        }
        return instance;
    }

    public String getDatabaseUrl() {
        return databaseUrl;
    }   

    public String getApiKey() {
        return apiKey;
    }   
}
