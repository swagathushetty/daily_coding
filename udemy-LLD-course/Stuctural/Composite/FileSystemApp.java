
public class FileSystemApp {
    public static void main(String[] args) {
        // File file1 = new File("file1.txt");
        // File file2 = new File("file2.txt");
        // File file3 = new File("file3.txt");

        // Folder folder1 = new Folder("folder1");
        // folder1.addFile(file1);
        // folder1.addFile(file2);

        // Folder folder2 = new Folder("folder2");
        // folder2.addFile(file3);

        // folder1.showDetails();
        // folder2.showDetails();


        FileSystemComponent file1 = new File("file1.txt");
        FileSystemComponent file2 = new File("file2.txt");
        Folder folder1 = new Folder("folder1");
        folder1.addComponent(file1);
        folder1.addComponent(file2);

        Folder subFolder = new Folder("subFolder");
        FileSystemComponent file3 = new File("file3.txt");
        subFolder.addComponent(file3);
        folder1.addComponent(subFolder);


        folder1.showDetails();



    }
}
