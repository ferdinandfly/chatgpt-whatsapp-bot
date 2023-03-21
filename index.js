const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Configuration, OpenAIApi } = require("openai");

require('dotenv').config()

const myCustomId = 'chatgpt-bot'

const client = new Client({
    takeoverOnConflict: true,
    takeoverTimeoutMs: 10,
    authStrategy: new LocalAuth({ clientId: myCustomId })
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


client.on('message', message => {
    console.log(message.body);
    if (message.from.startsWith('33648310496@c.us') || message.from.startsWith('33650520242@c.us')) {
        runCompletion(message.body.substring(1)).then(result => {
            console.log(result);
            return message.reply(result);
        });
    }
});

async function runCompletion(message) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message + ",Répondez avec un ton amical, en utilisant les vocabulaires basiques, et ajoutez le pinyin sur toutes les réponses",
        max_tokens: 200,
    });
    return completion.data.choices[0].text;
}

function runCompletionPrestatement() {
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: 'Répondez avec un ton amical, en utilisant les vocabulaires basiques, et ajoutez le pinyin sur toutes les réponses.',
        max_tokens: 200,
    }).then(completion => console.log(completion.data.choices[0].text));
}

async function runChatCompletion(message) {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { "role": "user", "content": message },
        ],
        max_tokens: 200,
    });

    return completion.data.choices[0].message.content;
}
function runChatCompletionprestatement() {
    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { "role": "system", "content": "用hsk3级词汇回答" },
            { "role": "system", "content": "用友好的口气回答" },
            { "role": "system", "content": "所有的回答加上拼音" },
            { "role": "system", "content": "répond les questions français en chinois" },
        ],
        max_tokens: 200,
    }).then(completion => console.log(completion.data.choices[0].message.content));
}

function runchatV4(){
    openai.createChatCompletion({
        model: "gpt-4",
        messages: [
            { "role": "system", "content": "用hsk3级词汇回答" },
            { "role": "system", "content": "用友好的口气回答" },
            { "role": "system", "content": "所有的回答加上拼音" },
            { "role": "system", "content": "répond les questions français en chinois" },
        ],
        max_tokens: 200,
    }).then(completion => console.log(completion.data.choices[0].message.content));
}