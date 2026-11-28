#include<stdio.h>
#include<unistd.h>

int main(){
    int number = 5;
    while(number > 0){
        printf("%d\n",number);
        sleep(1);
        number--;
    }
    return 0;
}