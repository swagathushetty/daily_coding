package Solution;


interface Button {
    void render();
}

interface ScrollBar {
    void scroll();
}

class WindowsButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering a windows button.");
    }
}

class MacOSButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering a macOS button.");
    }
}

class WindowsScrollBar implements ScrollBar {
    @Override
    public void scroll() {
        System.out.println("Rendering a windows scroll bar.");
    }
}

class MacOSScrollBar implements ScrollBar {
    @Override
    public void scroll() {
        System.out.println("Rendering a macOS scroll bar.");
    }
}


interface UIFactory {
    Button createButton();
    ScrollBar createScrollBar();
}


class WindowsFactory implements UIFactory {
    @Override
    public Button createButton() {
        return new WindowsButton();
    }

    @Override
    public ScrollBar createScrollBar() {
        return new WindowsScrollBar();
    }
}

class MacOSFactory implements UIFactory {
    @Override
    public Button createButton() {
        return new MacOSButton();
    }

    @Override
    public ScrollBar createScrollBar() {
        return new MacOSScrollBar();
    }
}

public class Application {

    private Button button;
    private ScrollBar scrollBar;

    public Application(UIFactory factory) {
        this.button = factory.createButton();
        this.scrollBar = factory.createScrollBar();
    }

    public void renderUI() {
        this.button.render();
        this.scrollBar.scroll();
    }

    public static void main(String[] args) {
        UIFactory windowsFactory = new WindowsFactory();
        Application windowsApp = new Application(windowsFactory);
        windowsApp.renderUI();

        UIFactory macFactory = new MacOSFactory();
        Application macApp = new Application(macFactory);
        macApp.renderUI();
    }
}
