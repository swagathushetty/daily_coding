#include<stdio.h>

int main() {
    float pi,r,answer;

    printf("What is R in cm\n");
    scanf("%f",&r);

    pi = 3.14;
    answer = 2 * pi * r;
    printf("The circumference is %f cm",answer);

    return 0;
}