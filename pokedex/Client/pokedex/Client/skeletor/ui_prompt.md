1 I want to implement supabase authentication for my application users. With that said I want you to use the following resources for context before executing this task:

- user journey: @./skeletor/user_journey.md
- db schema: @./skeletor/db_schema.sql
- entire front-end prompt: @./


The user should be able to conduct the following actions:

- a new user should be capable of registering an account upon registration they should be logged in and routed to the homepage.

- a returning user should be able to login and be routed to the homepage on success. 

- failure to authenticate upon submitting either for registration and/or login the user should be advised of the errors and allowed to re-attempt login and/or registration.

- an authenticated user should only be able to view their own tasks.

- Upon refresh an authenticated user should remain authenticated and be routed to their last visited page prior to the refresh.

- an authenticated user should be able to logout of the application and be returned to the login page.


I want you to generate the actions above where each action represents a phase, verify each phase by using the playwright mcp to walk through the user journey as if you were the user, and confirm the action was built correctly.

Do you have any questions before executing this task?
