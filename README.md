TMing Project
=================
This is TMing project's web frontend builder. The purpose is to automate repetitive tasks and make code update more agile.

To develop using this builder, you need to do five things:

1. Write html markup in handlebars syntax, and place the source file in /source/templates
2. Write data for building HTML using Handlebars. This file is /source/data/data-structure.json
3. Write Javascript and place files in /source/js, update gulpfile to include these JS files in specific loading order
4. Write CSS and place files in /source/css, update gulpfile to include these CSS files in specific loading order
5. In Terminal, navigate to this project folder, and execute this command to build files: 

`npm run build`

Once it's done, you should see the generated HTML in /output/index.html. Use the following command to start a simple Node.js server and verify this page:

`npm start`

Once it's up, use your browser to open this page:

`http://localhost:3000`


Code Quality
=================
You may run this command to validate your Javascript file:

`npm start`