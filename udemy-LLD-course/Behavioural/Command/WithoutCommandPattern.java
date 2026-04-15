


// UI button classes
class BoldButton {
    private TextEditor textEditor;

    public BoldButton(TextEditor textEditor) {
        this.textEditor = textEditor;
    }

    public void click() {
        textEditor.boldText();
    }
}

class ItalicButton {
    private TextEditor textEditor;

    public ItalicButton(TextEditor textEditor) {
        this.textEditor = textEditor;
    }

    public void click() {
        textEditor.italicText();
    }
}

class UnderlineButton {
    private TextEditor textEditor;

    public UnderlineButton(TextEditor textEditor) { 
        this.textEditor = textEditor;
    }
    public void click() {
        textEditor.underlineText();
    }
}



public class WithoutCommandPattern {
    public static void main(String[] args){

        TextEditor textEditor = new TextEditor();

        BoldButton boldButton = new BoldButton(textEditor);
        ItalicButton italicButton = new ItalicButton(textEditor);
        UnderlineButton underlineButton = new UnderlineButton(textEditor);

        boldButton.click();
        italicButton.click();
        underlineButton.click();
    }
}