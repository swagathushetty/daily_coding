public class WithoutSingleton {
    public static void main(String[] args) {
        AppSettings settings1 = new AppSettings();
        AppSettings settings2 = new AppSettings();
        System.out.println("Settings 1 Database URL: " + settings1.getDatabaseUrl());

        //this will create a new instance of AppSettings, which is not what we want in a singleton pattern
        System.out.println("Settings 2 Database URL: " + settings2.getDatabaseUrl());

        // Output will show that settings1 and settings2 are different instances
        System.out.println("Are settings1 and settings2 the same instance? " + (settings1 == settings2));
    }
}
