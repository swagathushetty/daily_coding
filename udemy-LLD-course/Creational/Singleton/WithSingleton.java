public class WithSingleton {
    public static void main(String[] args) {
        AppSettings2 settings1 = AppSettings2.getInstance();
        AppSettings2 settings2 = AppSettings2.getInstance();
        System.out.println("Settings 1 Database URL: " + settings1.getDatabaseUrl());

        //this will return the same instance of AppSettings2, which is what we want in a singleton pattern
        System.out.println("Settings 2 Database URL: " + settings2.getDatabaseUrl());

        // Output will show that settings1 and settings2 are the same instance
        System.out.println("Are settings1 and settings2 the same instance? " + (settings1 == settings2));
    }
}
