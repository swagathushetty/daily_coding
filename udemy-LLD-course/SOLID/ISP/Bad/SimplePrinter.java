
public class SimplePrinter implements Machine{
    
    public void print(Document doc) {
        // printing logic
    }

    //bad implementation as the printer does not support scanning and copying
    public void scan(Document doc) {
        throw new UnsupportedOperationException("Scan not supported");
    }

    public void copy(Document doc) {
        throw new UnsupportedOperationException("Copy not supported");
    }
}
