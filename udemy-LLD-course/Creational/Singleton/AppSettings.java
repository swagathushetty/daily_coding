
public class AppSettings {
    private String databaseUrl;
    private String apiKey;

    public AppSettings(){
        //read settings from a config file
        databaseUrl = "jdbc:mysql://localhost:3306/mydb";
        apiKey = "1234567890";
    }

    public String getDatabaseUrl() {
        return databaseUrl;
    }   

    public String getApiKey() {
        return apiKey;
    }   
}
