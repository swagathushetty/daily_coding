package Problem;

class WindowsButton {
    public void render() {
        System.out.println("Rendering a windows button.");
    }
}

class WindowsScrollBar {
    public void scroll() {
        System.out.println("Rendering a windows scroll bar.");
    }
}


class MacOSButton {
    public void render() {
        System.out.println("Rendering a macOS button.");
    }
}

class MacOSScrollBar {
    public void scroll() {
        System.out.println("Rendering a macOS scroll bar.");
    }
}


// the Application is tighly coupled to the concrete classes of buttons and scroll bars, 
// which makes it difficult to add new types of UI components without modifying the existing code. 
// This violates the Open/Closed Principle, 
// which states that software entities should be open for extension but closed for modification.
//  To solve this problem, we can use the Abstract Factory design pattern to create families of related objects without specifying their concrete classes.
public class Application{
    public static void main(String[] args) {

        // here we can technically add a mac scroll bar for windows but that would 
        // be a violation of the open closed principle
        // we can use abstract factory to solve this problem and create families of related objects without specifying their concrete classes
        WindowsButton windowsButton = new WindowsButton();
        WindowsScrollBar windowsScrollBar = new WindowsScrollBar();
        windowsButton.render();
        windowsScrollBar.scroll();

        MacOSButton macOSButton = new MacOSButton();
        MacOSScrollBar macOSScrollBar = new MacOSScrollBar();
        macOSButton.render();
        macOSScrollBar.scroll();
    }
}