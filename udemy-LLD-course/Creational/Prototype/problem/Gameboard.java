package udemy-LLD-course.Creational.Prototype.problem;

import java.util.ArrayList;
import java.util.List;

public class Gameboard {
    private List<Gamepiece> pieces = new ArrayList<>();

    public void addPiece(Gamepiece piece) {
        pieces.add(piece);
    }

    public List<Gamepiece> getPieces(){
        return pieces;
    }

    public void showCurrentBoardState(){
        for (Gamepiece piece : pieces) {
            System.out.println(piece);
        }
    }
}
