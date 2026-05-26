
import java.util.ArrayList;
import java.util.List;

interface ChatMediator {
    void sendMessage(String msg, ChatUser user);
    void addUser(ChatUser user);
}

class ChatRoom implements ChatMediator {
    private final List<ChatUser> users;

    public ChatRoom() {
        this.users = new ArrayList<>();
    }

    @Override
    public void sendMessage(String msg, ChatUser user) {
        for (ChatUser u : users) {
            if (u != user) {
                u.receiveMessage(msg, user);
            }
        }
    }

    @Override
    public void addUser(ChatUser user) {
        this.users.add(user);
    }
}

class ChatUser {
    private final String name;
    private final ChatMediator mediator;

    public ChatUser(String name, ChatMediator mediator) {
        this.name = name;
        this.mediator = mediator;
    }

    public void sendMessage(String msg) {
        mediator.sendMessage(msg, this);
    }

    public void receiveMessage(String msg, ChatUser sender) {
        System.out.println(this.name+ " received: " + msg + " from " + sender.getName());
    }

    public String getName() {
        return name;
    }
}

public class WithMediator {
    public static void main(String[] args) {
        ChatMediator mediator = new ChatRoom();

        ChatUser alice = new ChatUser("Alice", mediator);
        ChatUser bob = new ChatUser("Bob", mediator);
        ChatUser charlie = new ChatUser("Charlie", mediator);

        mediator.addUser(alice);
        mediator.addUser(bob);
        mediator.addUser(charlie);

        alice.sendMessage("Hello everyone!");
    }
}
