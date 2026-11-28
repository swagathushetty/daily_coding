#include<stdio.h>


int area_triangle(int b, int h){
    return (b * h)/2;
}

int main(){
    int b, h, area;

    printf("enter the base ");
    fflush(stdout); //means flush the output buffer and print the output immediately
    scanf("%d",&b);

    printf("enter the height ");
    fflush(stdout);
    scanf("%d",&h);

    //unlike js and python we cannot declare a fn inside another fn in c. So we have to declare the fn before main and define it after main
    area = area_triangle(b,h);
    printf("The area of triangle is %d",area);

    return 0;
}


