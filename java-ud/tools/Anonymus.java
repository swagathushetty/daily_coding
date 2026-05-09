package  tools;

class A {
  public A(){
    System.out.println("Object Created");
  }
  public void show(){
    System.out.println("Hello World");
  }
}

public class Anonymus {
    public static void main(String a[]){
      new A();
    }
}