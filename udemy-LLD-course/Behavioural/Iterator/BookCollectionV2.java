
import java.util.ArrayList;
import java.util.List;

public class BookCollectionV2 {

    //if in future we want to change from ArrayList to LinkedList
    //we can do that by simply changing the internal implementation 
    // of BookCollectionV2 without affecting the client code
    public List<Book> books = new ArrayList<>();

    public void addBook(Book book) {
        books.add(book);
    }

    public List<Book> getBooks() {
        return books;
    }

    public Iterator<Book> createIterator() {
        return new BookIterator(this.books);
    }


    // Another class(Nested class) 
    private class BookIterator implements Iterator<Book> {
        private List<Book> books;
        private int position = 0;

        public BookIterator(List<Book> books) {
            this.books = books;
        }

        @Override
        public boolean hasNext() {
            return position < books.size();
        }

        @Override
        public Book next() {
            if (!hasNext()) {
                throw new IllegalStateException("No more elements");
            }
            return books.get(position++);
        }
    }
}
