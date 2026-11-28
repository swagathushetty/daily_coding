#include<stdio.h>
#include<unistd.h>
#include<stdlib.h>

int main(){

    int balance = 1000;
    int bet = 0;
    int guess = 0;

    while(true){
    
        printf("*** Welcome to the Dice Game ***\n");
        printf("Your balance is %d Rupees and now please start with your bet\n",balance);
        scanf("%d",&bet);

        if(bet == 0){
            printf("Sorry cannot play with 0 bet\n");
            break;
        }

        if(balance < bet){
            printf("Sorry you do not have enough balance to place this bet\n");
            break;
        }

        printf("Please now input your guess between 1-6\n");
        scanf("%d",&guess);

        if(guess == 0){
            printf("you entered an invalid guess.Quitting the games\n");
            sleep(1);
            break;
        }

        printf("Throwing the dice........\n");
        printf("\n");
        sleep(2);
        printf("Now generating the results........\n");
        printf("\n");
        sleep(2);

        int pid = getpid();
        srand(pid);
        
        int diceValue =  rand() % 7 + 1;

        if(diceValue == guess){
            printf("Youuuuu won !!!!!!!\n");
            balance += bet;
            bet = 0;
        }else{
            printf("EEEhhhh. you lost\n");
            balance -= bet;
        }
        printf("\n");

        printf("your balance is now %d\n",balance);

        if(balance <= 0){
            printf("Sorry you lack the funds to continue the game...\n");
            break;
        }

        printf("A Round has been completed. Starting the next round...\n");
        sleep(3);
        printf("\n\n\n");

    }

    printf("Thank you for playing. please come again !");


    return 0;
}