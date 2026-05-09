
class CSVParser {
    public void parse(){
        openFile();
        // CSV specific parsing logic
        System.out.println("Parsing CSV file...");
        closeFile();
    }

    private void openFile() {
        System.out.println("Opening CSV file...");
    }

    private void closeFile() {
        System.out.println("Closing CSV file...");
    }
}

public class JSONParser {
    public void parse(){
        openFile();
        // JSON specific parsing logic
        System.out.println("Parsing JSON file...");
        closeFile();
    }

    private void openFile() {
        System.out.println("Opening JSON file...");
    }

    private void closeFile() {
        System.out.println("Closing JSON file...");
    }
}


public class WithoutTemplatePattern {
    public static void main(String[] args){
        CSVParser csvParser = new CSVParser();
        csvParser.parse();

        JSONParser jsonParser = new JSONParser();
        jsonParser.parse();
    }
}
