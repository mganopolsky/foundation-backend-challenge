Future todo: 

* Separate out separate service for historical loading & hourly loading
* implement API as a graphQL endpoint
* Adding more informative loggin
* putting in a lot more thought in the db schema - proper foreign keys, indexing, etc
* batch this by some time period per TOKEN in separate processes 
* a whole lot more tests
* create stored procedures to return the data from the db, and use something like Terraform to keep track of the db-related code, as opposed to writing it directly in the code

** optimizing batch writing to db - 100 is probably ok, but any more, using a COPY command might be better. Better yet, an ORM might be really helpful s