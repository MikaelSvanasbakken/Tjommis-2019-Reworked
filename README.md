### Ionic ####
Ionic is a pretty easy-to-use framework. So all you should need to do is to:

- npm install -g ionic
- Save this project in preferred folder.
- Navigate to the folder you saved the project in, and run ionic start.



## About Tjommis ##

This is an application we made in Ionic, the purpose of Tjommis is that you create your own user, log in and then you'll set your interests and tags so that you later get matched with someone with the same interests as you.

After you've done this, you can click the "Tjommis button" on the main screen, there are one button for 1 to 1 conversations and a button that lets you connect to several people at once, to create a group for an event or something like that.

It matches based on a algorithm we made that gives users scores compared to eachother based on interests and tags, the higher the score the higher the likelyhood for you to get matched.

Due to restrictions we couldn't implement Feide Login (The schools primary method of authenticating who you are) which would also function as a sort of filter to stop bots and so on), so the authentication matches you against a database we've hosted in Azure which salts and peppers the passwords and sensitive information when you create a user.
