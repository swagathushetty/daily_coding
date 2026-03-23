
public class Student {
    int rollNo;
    String name;
    int marks;
}

public class ArrayDemo {
    public static void main(String[] args){

        Student s1 = new Student();
        s1.rollNo = 1;
        s1.name = "John";
        s1.marks = 80;

        Student s2 = new Student();
        s2.rollNo = 2;
        s2.name = "Jane";
        s2.marks = 90;
         
        Student s3 = new Student();
        s3.rollNo = 3;
        s3.name = "Jack";
        s3.marks = 100;
        
        Student students[] = new Student[3];
        students[0] = s1;
        students[1] = s2;
        students[2] = s3;
        // for(int i=0;i<students.length; i++){
        //     System.out.println(students[i].name + " scored " + students[i].marks);
        // }
        for(Student s : students){
            System.out.println(s.name + " scored " + s.marks);
        }

        // int arr[] = new int[5];
        // arr[0] = 10;
        // arr[1] = 20;
        // arr[2] = 30;

        // for(int i=0; i<arr.length; i++){
        //     System.out.println(arr[i]);
        // }
    }
}
