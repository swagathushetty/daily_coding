package prototypeSolution;

public class GameClientWIthPrototpye {
    public static void main(String[] args){
        Gameboard gameboard = new Gameboard();

        Gamepiece redPiece = new Gamepiece("Red", 1);
        Gamepiece bluePiece = new Gamepiece("Blue", 2);
        Gamepiece greenPiece = new Gamepiece("Green", 3);
        gameboard.showCurrentBoardState();

        //i want to checkpoint the gameboard state at this point
        
         Gameboard copiedBoard = gameboard.clone();
        //client doenst need to worry about cloning the pices anymore
        System.out.println("\nCheckpoint Board State:");
        copiedBoard.showCurrentBoardState();


    }
        
}
