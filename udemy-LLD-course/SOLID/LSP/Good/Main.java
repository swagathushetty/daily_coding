public class Main {
    public static void main(String[] args){
        ReadableFile readableFile = new ReadableFile();
        WritableFile writableFile = new WritableFile();
        readableFile.read();
        // readableFile.write(); // compile time error, LSP is not violated
        writableFile.read();
        writableFile.write();
    }
}
