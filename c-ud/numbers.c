#include<stdio.h>

int main(){
    int x,y;

    printf("Select one number\n");
    scanf("%d",&x); 
     
    printf("Select one number\n");
    scanf("%d",&y); 

    int answer = x + y;
    printf("The sum is %d ",answer);
    return 0;
}
