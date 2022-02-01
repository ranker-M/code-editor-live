# Code-editor-live

An online code editor and compiler for 8+ different language. Number of language can be increased. 

Source code: https://github.com/ranker-M/code-editor-live
<br>Live Demo: https://code-editor-live.herokuapp.com

**Tech stack:**
<br>**Front-end:** React.js
<br>**Backend:** Node.js, Express.js
<br>**Authentication:** Firebase
<br>**Database:** MongoDB
<br>**Code Editor:** CodeMirror
<br>**Compiler API:** Sphere Engine Compilers (free trial ends: Jan. 29, 2022, 12:29 a.m.)
<br>**Deployed:** Heroku

**Note:** I used Sphere Engine Compiler API to compile codes and I am using free-trial version of it. If I don't renew it, 
it will expire at Feb. 15, 2022, 4:30 p.m. So, compiler function won't work afterwards. But other functions should work as it should be.

This proejct is deployed at Heroku as an Express server and it is using static React.js files to create web pages. The basic logic is:<br>
Build react app --> nominate build file as a static file in server --> send index.html as a respond for all requests other than api requests

In this project, there are plenty of vulnaribilities for malicious attacks so it is not recommended for using this source code in commercial projects.
