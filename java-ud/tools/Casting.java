package tools;

class A {
    public void show1() {
        System.out.println("Inside A");
    }
}

class B extends A {
    
    public void show2() {
        System.out.println("Inside B");
    }
}


public class Casting {
   public static void main(String[] args) {
        A obj = new A();
        obj.show1();

        A obj2 = (A)new B(); //upcasting aka use parent class reference to refer to child class object
        obj2.show1();

        B obj1 = (B)obj; //downcasting aka use child class reference to refer to parent class object
        obj1.show2();
   }
}
