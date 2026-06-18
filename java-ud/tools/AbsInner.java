package tools;


abstract class A {
    public abstract void show();
}

public class B extends A {
    @Override
    public void show() {
        System.out.println("Hello from class B!");
    }
} 

public class AbsInner {
    public static void main(String[] args) {
        A a = new A() 
        // below is an anonymous inner class that extends A and provides implementation for the abstract method show()
        {
            @Override
            public void show() {
                System.out.println("Hello from anonymous inner class!");
            }
        };
        a.show();


        A b = new B();
        b.show();

        
    }
}

//when to use ?
//1. When you need to create a one-time use class that implements an interface or extends a class without the
// need for a separate named class.
//2. When you want to provide a quick implementation of an interface or abstract class without the
// overhead of creating a full class definition.
