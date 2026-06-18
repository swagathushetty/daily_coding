package tools;

// interface just shows you design
interface A {

    // all variablees inside iterface are
    // final and static by default
    int age=44;
    String area="Mumbai";


    // by default all methods in interface are
    //public absract
    // but we skip the keywords for simplicity
    void display();
    void show();

    //or
    // public abstract void display();
    // public abstract void show();
}






interface X {
    void method1();
    void method2();
}


// we can have multiple interfaces in a program
interface Y extends X {
    void method3();
    void method4();
}

// if we dont want to implement all the methods of the interface
//  we can use abstract class
abstract class B implements A {}


// we can implement multiple interfaces in a class
class C implements A,X {
    @Override
    public void display() {
        System.out.println("Display method implemented in class C");
    }

    @Override
    public void show() {
        System.out.println("Show method implemented in class C");
    }

    @Override
    public void method1() {
        System.out.println("Method1 implemented in class C");
    }

    @Override
    public void method2() {
        System.out.println("Method2 implemented in class C");
    }
}


interface Computer {
    void code();
}

class Laptop implements Computer { 
    public void code(){
        System.out.println("Coding on laptop");
    }
}

class Desktop implements Computer {
    public void code(){
        System.out.println("Coding on desktop");
    }
}



class Developer {

    //Laptop is an issue
    // since devApp method accepts only Laptop type
    public void devApp(Computer computer){
         computer.code();
        System.out.println("Developer is developing an application");
    }
}



public class InterfaceDemo {
    public static void main(String[] args) {
      
       Computer laptop = new Laptop();
       Computer desktop = new Desktop();
       Developer developer = new Developer();
         developer.devApp(laptop);
         developer.devApp(desktop);
    }
}