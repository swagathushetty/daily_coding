class A {
    public void show() {
        System.out.println("In A's show method");
    }
}


class B extends A {
    @Override
    public void show() {
        System.out.println("In B's show method");
    }
}


class Computer {

}

class Laptop extends Computer {

}
public class DynamicMethodDispatch {
    public static void main(String[] args) {
        A obj = new A();
        obj.show();

        obj = new B();
        obj.show(); // Dynamic method dispatch

    }


}
