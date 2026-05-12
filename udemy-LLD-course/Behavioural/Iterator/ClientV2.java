
public class ClientV2 {
    public static void main(String[] args) {
        BookCollectionV2 bookCollection = new BookCollectionV2();
        bookCollection.addBook(new Book("Book 1"));
        bookCollection.addBook(new Book("Book 2"));
        bookCollection.addBook(new Book("Book 3"));

        Iterator<Book> iterator = bookCollection.createIterator();
        while (iterator.hasNext()) {
            Book book = iterator.next();
            System.out.println(book);
        }
    }
}
