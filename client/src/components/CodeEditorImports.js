import { cpp } from "@codemirror/lang-cpp"
import { html } from "@codemirror/lang-html"
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { lezer } from "@codemirror/lang-lezer";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python"
import { rust } from "@codemirror/lang-rust"
import { sql } from "@codemirror/lang-sql"
import { xml } from "@codemirror/lang-xml"

const optionList = {
  "themes": [
    "dark",
    "light"
  ],
  "languages": {
    "cpp": { extension: cpp(), fileExtension: "cpp" },
    // "html": { extension: html(true, true), fileExtension: "html" },
    "java": { extension: java(), fileExtension: "java" },
    "javascript": { extension: javascript(), fileExtension: "js" },
    // "json": { extension: json(), fileExtension: "json" },
    // "markdown": { extension: markdown(), fileExtension: "md" },
    "php": { extension: php(), fileExtension: "php" },
    "python": { extension: python(), fileExtension: "py" },
    "rust": { extension: rust(), fileExtension: "rs" },
    "sql-schema": { extension: sql(), fileExtension: "sql" },
    "sql-queries": { extension: sql(), fileExtension: "sql" },
    // "xml": { extension: xml(), fileExtension: "xml" },
    // "jsx": { extension: javascript({ jsx: true }), fileExtension: "jsx" },
    "typescript": { extension: javascript({ typescript: true }), fileExtension: "ts" },
    // "tsx": { extension: javascript({ jsx: true, typescript: true }), fileExtension: "tsx" }
  }
};

const exampleCode = {
  "cpp": `#include <iostream>
using namespace std;

int main() {
int i, n;
    bool isPrime = true;

    cout << "Enter a positive integer: ";
    cin >> n;

    // 0 and 1 are not prime numbers
    if (n == 0 || n == 1) {
        isPrime = false;
    }
    else {
        for (i = 2; i <= n / 2; ++i) {
            if (n % i == 0) {
                isPrime = false;
                break;
            }
        }
    }
    if (isPrime)
        cout << n << " is a prime number";
    else
        cout << n << " is not a prime number";

    return 0;
}`,

  // "html": ,
  "java": `import java.io.*;
  
  /* Name of the class has to be "Main" only if the class is public. */
  class main
  {
    public static void main (String[] args) throws java.lang.Exception
    {
      BufferedReader r = new BufferedReader (new InputStreamReader (System.in));
      String s;
      while (!(s=r.readLine()).startsWith("42")) System.out.println(s);
    }
  }
  
  // Enter some input in input area
  // input should contain at least one 42`,
  "javascript": `// Use print() instead of console.log() in Rhino compiler

  importPackage(java.io); 
  importPackage(java.lang);
  var stdin = new BufferedReader( new InputStreamReader(System['in']) )
  
  // take input from the user
  //print("Enter a positive number: ");
  //var number = parseInt(stdin.readLine());
  
  const number=156;
  let isPrime = true;
  
  // check if number is equal to 1
  if (number === 1) {
      print("1 is neither prime nor composite number.");
  }
  
  // check if number is greater than 1
  else if (number > 1) {
  
      // looping through 2 to number-1
      for (let i = 2; i < number; i++) {
          if (number % i == 0) {
              isPrime = false;
              break;
          }
      }
  
      if (isPrime) {
          print(number+" is a prime number");
      } else {
          print(number+" is a not prime number");
      }
  }
  
  // check if number is less than 1
  else {
      print("The number is not a prime number.");
  }`,
  // "json": ,
  // "markdown": ,
  "php": `<?php

    // your code goes here
        $name = "lcodeshare";
        print "<h1>Hello User, </h1> <p>Welcome to {$name}</p>";
    ?>`,

  "python":
    `# your code goes here
# Program to check if a number is prime or not

# num = 407

# To take input from the user
num = int(input("Enter a number: "))

# prime numbers are greater than 1
if num > 1:
    # check for factors
    for i in range(2,num):
        if (num % i) == 0:
            print(num,"is not a prime number")
            print(i,"times",num//i,"is",num)
            break
    else:
        print(num,"is a prime number")

# if input number is less than
# or equal to 1, it is not prime
else:
    print(num,"is not a prime number")`,
  "rust": `use std::io::stdin;
     use std::io::BufRead;
     use std::io::BufReader;

     fn main() {
         let greetings = ["Hello", "Hola", "Bonjour",
                          "Ciao", "こんにちは", "안녕하세요",
                          "Cześć", "Olá", "Здравствуйте",
                          "Chào bạn", "您好", "Hallo",
                          "Hej", "Ahoj", "سلام"];

         for (num, greeting) in greetings.iter().enumerate() {
             print!("{} : ", greeting);
             match num {
                 0 =>  println!("This code is editable and runnable!"),
                 1 =>  println!("¡Este código es editable y ejecutable!"),
                 2 =>  println!("Ce code est modifiable et exécutable !"),
                 3 =>  println!("Questo codice è modificabile ed eseguibile!"),
                 4 =>  println!("このコードは編集して実行出来ます！"),
                 5 =>  println!("여기에서 코드를 수정하고 실행할 수 있습니다!"),
                 6 =>  println!("Ten kod można edytować oraz uruchomić!"),
                 7 =>  println!("Este código é editável e executável!"),
                 8 =>  println!("Этот код можно отредактировать и запустить!"),
                 9 =>  println!("Bạn có thể edit và run code trực tiếp!"),
                 10 => println!("这段代码是可以编辑并且能够运行的！"),
                 11 => println!("Dieser Code kann bearbeitet und ausgeführt werden!"),
                 12 => println!("Den här koden kan redigeras och köras!"),
                 13 => println!("Tento kód můžete upravit a spustit"),
                 14 => println!("این کد قابلیت ویرایش و اجرا دارد!"),
                 _ =>  {},
             }
         }
     }
     `,
  "sql-queries": `select * from tbl;`,
  "sql-schema": `-- your code goes here
  create table tbl(str varchar(20));
  insert into tbl values('Hello world!');
  select * from tbl;`,
  // "xml": ,
  // "jsx": ,
  "typescript": `function isPrime(n){
    for(let i = 2; i < n;i++){
      if(n % i === 0)
      return 'notPrime'
      return 'prime'
    }
  }
  console.log(isPrime(18))
  
  function prime(n){
    for (var i = 0; i <= n; i++) {
    var isPrime = false;
    for (var j = 2; j <= i; j++) {
      if (i % j === 0 && j !== i) {
        isPrime = true;
      }
    }
    if (isPrime === false) console.log(i);
  }
  }
  prime(100)`,
  // "tsx": 
}


export { optionList, exampleCode };
