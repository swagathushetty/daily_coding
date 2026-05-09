package tools;

class A {
    public void show(){
        System.out.println("Show method in class A");
    }
}


class B extends A {
    @Override
    public void show() {
        System.out.println("Show method in class B");
    }
}




public class MethodOverride {
    public static void main(String[] args) {
        A a = new A();
        a.show();

        B b = new B();
        b.show();
    }
}
