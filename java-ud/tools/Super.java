package tools;
class A {
    public A(){
        System.out.println("Object Created in A");
    }

    public A(int x){
        System.out.println("Object Created in A with parameter: " + x);
    }
}

class B extends A {
    public B(){
        // if we dont call super java will call the default constructor
        // so we can skip the super() call if we want to call the default constructor of parent class
        System.out.println("Object Created in B");
    }
    public B(int x){
        //if we dont call super java will call the default constructor
        // and not the parameterized parent constructor
        super(x);
        System.out.println("Object Created in B with parameter: " + x);
    }
}

public class Super {
    public static void main(String a[]){
        B b = new B(); // both constructor will be called, first A then B because of super() call in B's constructor

        B b2 = new B(2);
    }
}