# twitch-chat-bot
A chat bot I'm using while streaming on Twitch

<h1>What exactly is this?</h1>

Basically it's just a small twitch bot used in my streams to do stuff I like it to do. Decided to upload it here if someone is interested in making on themselves. If someone would like to use this as a base to make their own bot, it should be very easy. Just edit the .env file with your own info and it should be good to go.

<h2>Commands</h2>

At the very beginning there's an array of normal commands and sound commands. Sound commands are not included in this bot, it's purely only made so that the bot doesn't try to check commands that do not exist when someone uses sound commands in my stream. They are a separate thing. Maybe I'll include them in this bot someday.

Most of the commands are in Finnish, but I'll try to explain them here.

!hello
Greets the user.

!rolldice
Returns a number between 1 and 6.

!komennot
Shows a list of available commands.

!liity
If a raffle is going on, a user can join it with this command.

!startraffle
Start a raffle. This must be used first before anyone can join. Currently the code explicitly tests if the user inputting this is me, but I'll change that so that it checks wheter the user is an admin.

!stopraffle
Stops the ongoing raffle and randomly selects a winner from the participants. They are instructed to contact the streamer to get the prize.

<h2>Future</h2>
Make the code cleaner by separating commands into separate files for easier management.
