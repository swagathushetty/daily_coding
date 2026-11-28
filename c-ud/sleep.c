#include<stdio.h>
#include<unistd.h>

int main(){ 

    printf("Waiting for 5 seconds...\n");
    sleep(5); // sleep for 5 seconds

    printf("Process completed!\n");

    return 0;
}