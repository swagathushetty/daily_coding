package udemy-LLD-course.Creational.Prototype.problem;

public class GameClientWithoutPrototype {
    public static void main(String[] args){
        Gameboard gameboard = new Gameboard();

        Gamepiece redPiece = new Gamepiece("Red", 1);
        Gamepiece bluePiece = new Gamepiece("Blue", 2);
        Gamepiece greenPiece = new Gamepiece("Green", 3);
        gameboard.showCurrentBoardState();

        //i want to checkpoint the gameboard state at this point
        Gameboard copiedBoard = new Gameboard();
        for(Gamepiece piece : gameboard.getPieces()){
            Gamepiece copiedPiece = new Gamepiece(piece.getColor(), piece.getPosition());
            copiedBoard.addPiece(copiedPiece);
        }
        System.out.println("\nCheckpoint Board State:");
        copiedBoard.showCurrentBoardState();
        // the above approach is not scalable, if we have 1000s of pieces, we will have to write a lot of code to copy each piece. This is where Prototype design pattern comes into picture.

    }
}
