public class TextEditorMain {
    
    public static void main(String[] args) {
     TextEditor editor = new TextEditor();
     Caretaker caretaker = new Caretaker();
     
     editor.write("Hello, World!");
     caretaker.saveState(editor);

    editor.write("Hello, Java!");
    caretaker.saveState(editor);
    
    caretaker.undo(editor);
    System.out.println("Current Content: " + editor.getContent());
    }
}
