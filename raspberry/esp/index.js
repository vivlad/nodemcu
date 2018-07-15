const TelegramBot = require('node-telegram-bot-api');
const settings = require('./settings');
const mcuQuery = require("./mcuQuery");

// replace the value below with the Telegram token you receive from @BotFather
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(settings.telegramToken, {polling: true});
 
// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
 
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
 
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/хай/i, (msg, match) => {
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
            [{ text: 'Show current data', callback_data: 'showData' }],
            [{ text: 'Remote control', callback_data: 'remoteControl' }],
            ]
        })
    };
  
    bot.sendMessage(msg.chat.id, 'Choose action:', options);
});

bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    if(data == 'showData') {
        //TODO: should be better way
        mcuQuery("sensor/temp", temp => {
            var message = "Temp: " + temp + " C; ";
            mcuQuery("sensor/hum", hum => {
                message += "Hum: " + hum;
                bot.answerCallbackQuery(callbackQuery.id)
                    .then(() => bot.sendMessage(msg.chat.id, message));
            });
        });
    } else if (data == 'remoteControl') {
        //This should be added 
        bot.answerCallbackQuery(callbackQuery.id)
            .then(() => bot.sendMessage(msg.chat.id, 'Coming soon'));
    } else {
        bot.answerCallbackQuery(callbackQuery.id)
            .then(() => bot.sendMessage(msg.chat.id, 'Incorrect reply'));
    }
});
