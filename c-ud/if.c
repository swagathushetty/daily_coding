#include<stdio.h>

int main(){
    int speed;
    printf("How fast are you driving?\n");
    scanf("%d",&speed);

    if(speed > 100){
        printf("You are over speeding\n");
    }
    else if(speed > 60){
        printf("You are driving at a normal speed\n");
    }
    else{
        printf("You are driving safely\n");
    }
    return 0;
}