
class User {
    private String name;

    public User(String name) {
        this.name = name;
    }

    public void sendMessage(String msg,User receiver){
        System.out.println(this.name + " sends: " + msg + " to " + receiver.getName());
        // receiver.receiveMessage(msg, this);
    }

    public String getName() {
        return name;
    }
}

public class WithoutMediator {
    public static void main(String[] args){
        User user1 = new User("Swagath");
        User user2 = new User("Rahul");

        //problem: each user needs to know about the other user to send a message, 
        // which creates tight coupling between users. If we want to add more users, we need to modify the existing code, which violates the Open/Closed Principle.
        //tight coupling: User class is tightly coupled with other User class, 
        // which makes it difficult to maintain and extend the code. If we want to add more users, we need to modify the existing code, which violates the Open/Closed Principle.
        user1.sendMessage("Hello, Rahul!", user2);  
        user2.sendMessage("Hi, Swagath! How are you?", user1);
    }
        
}
