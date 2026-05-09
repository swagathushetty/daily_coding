package tools;

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
        
        StringBuffer sb = new StringBuffer("Swagath");
        System.out.println(sb.capacity()); //starts with 16 + length of string
        sb.append(" Shetty");
        System.out.println(sb);

        // String s = sb; // StringBuffer can be assigned to String because of toString() method
        sb.deleteCharAt(2);
        sb.insert(1,'u');
        String s = sb.toString(); // Convert StringBuffer to String
        System.out.println(s);

    }
}
