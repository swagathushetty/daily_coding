
import java.util.Scanner;


public class QuestionService {
    Question[] questions = new Question[5];
    String[] selection = new String[5]; 

    public QuestionService() {
        questions[0] = new Question(1, "What is the capital of France?", "Berlin", "Madrid", "Paris", "Rome", "Paris");
        questions[1] = new Question(2, "What is the largest planet in our solar system?", "Earth", "Jupiter", "Mars", "Saturn", "Jupiter");
        questions[2] = new Question(3, "Who wrote 'To Kill a Mockingbird'?", "Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald", "Harper Lee");
        questions[3] = new Question(4, "What is the chemical symbol for water?", "H2O", "CO2", "O2", "NaCl", "H2O");
        questions[4] = new Question(5, "Who painted the Mona Lisa?", "Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Claude Monet", "Leonardo da Vinci");
    }
    public static void main(String[] args) {

        
        QuestionService questionService = new QuestionService();
        questionService.displayQuestions();
    }


    public void displayQuestions(){
        for(Question q:questions){
            System.out.println(q.getQuestion());
            System.out.println("Options:");
            System.out.println("A. " + q.getOpt1());
            System.out.println("B. " + q.getOpt2()); 
            System.out.println("C. " + q.getOpt3());
            System.out.println("D. " + q.getOpt4());

            Scanner sc = new Scanner(System.in);
            this.selection[q.getId() - 1] = sc.nextLine();

            for(String selection : this.selection){
                System.out.println("Your selection: " + selection);
            }
        }
    }
}
