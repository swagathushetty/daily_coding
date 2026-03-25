public class Strings {
    public static void main(String[] args) {
        String str1 = "Hello";
        String str2 = new String("Hello");

        //mutable vs immutable strings
        String name = "Swagath";
        name = name + "Shetty";
        System.out.println(name);


        String s1 = "Hello";
        String s2 = "Hello";
        System.out.println(s1 == s2); // true, because string literals are interned

    }
}
