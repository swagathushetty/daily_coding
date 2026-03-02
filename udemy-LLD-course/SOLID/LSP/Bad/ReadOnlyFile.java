

public class ReadOnlyFile extends File {
    
    public void write(){
        throw new UnsupportedOperationException("Cannot write to a read-only file");
    }
}
