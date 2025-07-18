# NC News Seeding

Env files are required to host specific environmental variables for use during different stages of the development process.

Config values are stored in the env files specific to that particular process being achieved. 

The env files are acccessd within our code and load in those values. So, in our case we are using a dev and a test environment. Each variant has a corresponding env file - .env.test and .env.development. 

Values in here are brought it at runtime via the dotenv utiliry and the correct env file is loaded with corresponding environmental variables loaded into the global process.env and can be accessed anywhere. 

In our instance, we are using two environments. test and development, and therefore have created two files to reflect this .env.test and .env.development. 

For our example, we are storing the PG database name, and therefore each file should have it's own database name specified. 

i.e. PGDATABASENAME=nc_news for development and PGDATABASENAME=nc_news_test for test. 
