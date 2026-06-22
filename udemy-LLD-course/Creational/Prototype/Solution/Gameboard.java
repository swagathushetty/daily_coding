package prototypeSolution;


import java.util.ArrayList;
import java.util.List;

public class Gameboard implements Prototype<Gameboard> {
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

    @Override
    public Gameboard clone() {
        Gameboard copiedBoard = new Gameboard();
        for(Gamepiece piece : this.pieces){
            copiedBoard.addPiece(piece.clone());
        }
        return copiedBoard;
    }
}
