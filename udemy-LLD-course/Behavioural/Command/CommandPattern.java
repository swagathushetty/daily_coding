interface Command {
    void execute();
}


class BoldCommand implements Command {

    private TextEditor textEditor;
    public BoldCommand(TextEditor textEditor) {
        this.textEditor = textEditor;   
    }

    @Override
    public void execute() {
        textEditor.boldText();
    }
}

class ItalicCommand implements Command {

    private TextEditor textEditor;
    public ItalicCommand(TextEditor textEditor) {
        this.textEditor = textEditor;   
    }

    @Override
    public void execute() {
        textEditor.italicText();
    }
}

class Button {
    private Command command;

    public void SetButton(Command command) {
        this.command = command;
    }

    public void click() {
        command.execute();
    }
}


public class CommandPattern {
    public static void main(String[] args){

        TextEditor textEditor = new TextEditor();

        Button button = new Button();
        button.SetButton(new BoldCommand(textEditor));
        button.click();

        button.SetButton(new ItalicCommand(textEditor));
        button.click();
    }
}
