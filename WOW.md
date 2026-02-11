We are using the following methodologies: BDD (Behavior Driven Development). 
We follow the following steps;
1. Write a feature file describing the feature in Gherkin syntax --> i'll give you a start of the feature, lets improve together until approved explicitly by me. Stop and ask approval before continuing.
2. Lets design the frontend , generate the new or adapted pages that the feature requires taking the styling of the project into account. I'll look at this preview and ask adapations until approved explicitly by me. Stop and ask approval before continuing.
3. Lets maybe adapt the feature file if needed. and write the cypress test steps for the file. Make sure you use a good structure in the test steps folder (under cypress > support). we don't want duplicate test steps and make sure each test step is reusable.
4. Lets write the backend code (fastAPI) to support the feature. and let me know if any database changes are needed. Give me the sql queries to run in supabase to create the needed tables or adapt existing tables.
5. make sure frontend/backend/test steps are completely aligned and give me a sign i can run the cypress tests.