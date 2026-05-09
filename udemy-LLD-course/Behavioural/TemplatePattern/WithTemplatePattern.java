


abstract class DataParser {

    public final void parse(){
        openFile();
        parseData();
        closeFile();
    }

    protected void openFile(){
        System.out.println("Opening file...");
    }

    protected void closeFile(){
        System.out.println("Closing file...");
    }

    protected abstract void parseData();
}

class CSVParser extends DataParser {
    
    @Override
    protected void parseData() {
        System.out.println("Parsing CSV data...");
    }
}


class JSONParser extends DataParser {
    
    @Override
    protected void parseData() {
        System.out.println("Parsing JSON data...");
    }
}


public class WithTemplatePattern {
    public static void main(String[] args) {
        DataParser parser = new CSVParser();
        parser.parse();

        DataParser jsonParser = new JSONParser();
        jsonParser.parse();
    }
}
