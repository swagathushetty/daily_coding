package Good;

public class MultiPurposeMachine implements Printer, Scanner, Copier {
    public void print(Document doc) {
        // printing logic
    }

    public void scan(Document doc) {
        // scanning logic
    }

    public void copy(Document doc) {
        // copying logic
    }

    public static void main(String[] args) {
        Document doc = new Document();

        MultiPurposeMachine mpm = new MultiPurposeMachine();
        mpm.print(doc);
        mpm.scan(doc);
        mpm.copy(doc);
        System.out.println("MultiPurposeMachine: print, scan, copy done.");

        SimplePrinter sp = new SimplePrinter();
        sp.print(doc);
        System.out.println("SimplePrinter: print done.");
    }
}
