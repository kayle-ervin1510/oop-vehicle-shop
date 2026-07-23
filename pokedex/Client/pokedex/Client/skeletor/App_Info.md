
# App Planning Outline

## Fundamental Questions

### Identifying the App

1. What problem does this app solve? - Provides parents with a secure way to keep their children from figuring out how to get around the screentime regulation set for specific apps, and around the restricted apps.

2. Why would someone use it? - To keep securely reduce screentime for their children with an application that prevents the children from logging in to change things, via multiple verification methods.

3. What pain point exists today? - Parents have a hard time regulating their children's screen time. Children excel at figuring out their parents passwords, or getting around the screentime regulation.

4. How are users solving this problem? - Taking away children's phones, using other screen monitoring apps, like quiltado, or bark


### Who is the user

1. Who will use this app? - Parents/Guardians

2. There is not any additional users. 

3. What information does this user need? - 
	a. manage a resource <time on apps>
	b. personal information: email, password, profiles, username, access to screen time data, access to device usage
	
### User Goals

1. What actions do people come here to accomplish? - To check on their child's screentime, and regulate it

2. Top 3 reasons they login 
	a. Update app time parameters - UPDATE|PUT
	b. Create a time restriction for an app - CREATE|POST
	c. Update app time restriction - UPDATE|PUT

### Information needed
1. What do users view? - User Interface, i.e. the following resources:
	a. profiles
	b. time parameters for apps
	c. password verification required apps
	d. Restricted apps (those that cannot be opened)

2. What should they never see? - Other user profiles and app restrictions.

3. What do they create, update and delete? - Time parameters for applications, restrictions for applications, password request for extended time on applications.

4. What can they not create, update, and delete? - Collected screen-time data, including how long each profiled user spent on apps.
 
	a. Why would this not be deleted, updated, or created? - The users cannot 	delete this data, as it is important for the rest of the application to 	run, and it is paramount that users not manipulate data to give false 	information. It cannot be created or updated by the user themselves, but 	rather by the backend of the program, self updating. One does not want a 	user updating the information, because the user could potentially edit the 	information to manipulate the 