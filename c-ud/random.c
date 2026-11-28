#include<stdio.h>
#include<stdlib.h>
#include<unistd.h>


int our_random_function(int max){
    int x;
    
    x = rand() % max + 1; // generate a random number between 1 and max

    return x;
}

int main(){
    int random_1, random_2;
    
    int pid = getpid(); // this we use as seed because it is unique for every process and will be different for every run of the program
    printf("The process id is %d\n",pid);
    srand(pid); // seed the random number generator with the process id

    random_1 = our_random_function(10); // generate a random number between 1 and 10
    printf("The random number is %d\n",random_1);

    random_2 = our_random_function(20); // generate a random number between 1 and 20
    printf("The random number is %d\n",random_2);

    return 0;
}