const tmi = require("tmi.js");
require('dotenv').config();

const BOT_USERNAME = process.env.BOT_USERNAME;
const TOKEN = process.env.OAUTH;
const CHANNEL_NAME = process.env.CHANNEL_NAME;
const commands = [
  "!hello",
  "!rolldice",
  "!komennot",
  "!liity",
  "!startraffle",
  "!stopraffle"
];
let isRaffleOn = false;
let raffleParticipants = [];
let intervalId;
const soundCommands = [
  '!eiketaan',
  '!pelottelette',
  '!bruh',
  '!buttons',
  '!jaa',
  '!eisiivauta',
  '!loputtomiin',
  '!rikokseensortuminen',
  '!epamiellyttava',
  '!ihminensisalla',
  '!seolirikki',
  '!hemulinauru',
  '!mitennii',
  '!pahkinoita',
  '!kaytavaankantautui',
  '!eipidapaikkaansa'
];

//Botin asetukset
const options = {
  identity: {
    username: BOT_USERNAME,
    password: TOKEN
  },
  channels: [
    CHANNEL_NAME
  ]
};

const client = new tmi.client(options);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

//Yhdistä botti Twitchiin
client.connect();

function onMessageHandler(channel, userstate, msg, self) {
  if (self) { return; } //Jätä viesti huomioimatta, jos botti
  const badges = userstate.badges || {};
  const isBroadcaster = badges.broadcaster;
  const isMod = badges.moderator;
  const isModUp = isBroadcaster || isMod;

  //If someone mentions the stream mascot, the bot will greet them with specialized reply
  if (msg.match(/tikuru/gi)) {
    client.say(channel, `Hei @${userstate.username}! Makoisaa päivää sinullekkin! 🐯🐯`);
  }

  //Poista turhat välit viestistä ja muunna pieniksi kirjaimiksi
  const commandName = msg.trim().toLowerCase();

  const commandArray = commandName.split(' ');

  //Tarkista alkaako viesti '!', jolloin kyseessä on komento
  if (!commandArray[0].startsWith('!')) { return; }

  //Suorita tunnistettu komento
  if (checkCommand(commandArray[0])) {
    switch (commandArray[0]) {
      case '!rolldice':
        if (checkParameters(commandArray, channel)) {
          break;
        }
        const luku = rollDice();
        client.say(channel, `Heitit numeron ${luku}`)
        console.log(`* Suoritti komennon ${commandName}`)
        break;
      case '!hello':
        if (checkParameters(commandArray, channel)) {
          break;
        }
        client.say(channel, `Päivää arvoisa @${userstate.username}`)
        console.log(`* Suoritti komennon ${commandName}`)
        break;
      case '!komennot':
        if (checkParameters(commandArray, channel)) {
          break;
        }
        client.say(channel, `Saatavilla olevat komennot: ${commands.join(', ')}`)
        client.say(channel, `Äänikomennot: ${soundCommands.join(', ')}`)
        console.log(`* Suoritti komennon ${commandName}`)
        break;
      case '!startraffle':
        if (!isBroadcaster) {
          client.say(channel, `Valitan, mutta sinulla ei ole tämän komennon oikeuksia :(`)
          break;
        }
        if (checkParameters(commandArray, channel)) {
          break;
        }
        startRaffle(userstate, channel);
        break;
      case '!stopraffle':
        if (!isBroadcaster) {
          client.say(channel, `Valitan, mutta sinulla ei ole tämän komennon oikeuksia :(`)
          break;
        }
        if (checkParameters(commandArray, channel)) {
          break;
        }
        stopRaffle(channel);
        break;
      case '!liity':
        if (checkParameters(commandArray, channel)) {
          break;
        }
        liity(userstate, channel);
        break;
      default:
        console.log("Jokin muu komento suoritettu (ääni)");
    }
  } else {
    client.say(channel, `Antamaasi komentoa ei löydy. Tarkista komennot kirjoittamalla !komennot`);
  };
};

//Tarkistaa löytyykö käyttäjän kirjoittama komento listalta. Jos ei, palauta ei löydy.
function checkCommand(command) {
  let isKnownCommand = false;
  isKnownCommand = commands.includes(command) || soundCommands.includes(command);

  return isKnownCommand;
};

function checkParameters(command, channel) {
  console.log(command);
  if (command.length > 1) {
    client.say(channel, `Tämä komento ei hyväksy ylimääräisiä parametreja!`);
    return true;
  }
}

//Aloita raffle
function startRaffle(userstate, channel) {
  if (isRaffleOn) {
    client.say(channel, `Nyt oli vähän noloa @${userstate.username}... Raffle on jo päällä!`);
  }

  if (!intervalId) {
    intervalId = setInterval(() => {
      client.say(channel, `Raffle on käynnissä. Jos haluat liittyä mukaan, kirjoita chattiin !liity`);
    }, 600000)
  }

  isRaffleOn = true;
  client.say(channel, `Kaikille katsojille huomioksi! Raffle on käynnistetty. Ilmoittaudu mukaan !liity komennolla!`);
};

//Lopeta raffle
function stopRaffle(channel) {
  if (!isRaffleOn) {
    client.say(channel, `Rafflea ei ole käynnissä!`);
    return;
  }

  clearInterval(intervalId);
  intervalId = null;

  let voittaja = '';

  isRaffleOn = false;

  if (raffleParticipants.length !== 0) {
    voittaja = raffleParticipants[Math.floor(Math.random() * raffleParticipants.length)];
    client.say(channel, `Voittaja on @${voittaja}! Onneksi olkoon! Pistä whisperiä striimaajalle niin pistetään peliavain tulemaan`)
    raffleParticipants = [];
  } else {
    raffleParticipants = [];
    client.say(channel, `Miten tämmönen voi olla edes mahdollista? Kukaan ei osallistunut kisaan, siispä palkintoa ei jaeta`);
  }
};

//Liity raffleen
function liity(userstate, channel) {
  if (!isRaffleOn) {
    client.say(channel, `@${userstate.username} raffle ei ole tällä hetkellä käynnissä.`)
    return;
  }

  if (!raffleParticipants.includes(userstate.username)) {
    raffleParticipants.push(userstate.username);
    client.say(channel, `${userstate.username}, olet nyt mukana arvonnassa. Onnea matkaan!`);
    return;
  }

  client.say(channel, `@${userstate.username}, olet jo mukana arvonnassa.`);
}

function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

function onConnectedHandler(address, port) {
  console.log(`* Yhdistetty osoitteeseen ${address}:${port}`);
  console.log(`Botti ${BOT_USERNAME} on nyt online!`);
}