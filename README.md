# code-editor-live

An online code editor and compiler for 8+ different language. Number of language can be increased. 

Source code:https://github.com/ranker-M/code-editor-live
\nLive Demo: https://code-editor-live.herokuapp.com

**Tech stack:**
**Front-end:** React.js
**Backend:** Node.js, Express.js
**Authentication:** Firebase
**Database:** MongoDB
**Compiler API:** Sphere Engine Compilers (free trial ends: Jan. 29, 2022, 12:29 a.m.)
**Deployed:** Heroku

**Note:** I used Sphere Engine Compiler API to compile codes and I am using free-trial version of it. If I don't renew it, 
it will expire at Jan. 29, 2022, 12:29 a.m. So, compiler function won't work afterwards. But other functions should work as it should be.

Deployed Heroku as an Express server and using static React.js files to create web pages. The basic logic is:
Build react app --> nominate build file as a static file in server --> send index.html as a respond for all requests other than ones for api

In this server, there are plenty of vulnaribilities for malicious attacks so it is not recommended for using these source codes in commercial projects.
