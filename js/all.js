const client = new tmi.Client({
	channels: [ 'totallynotmishashto' ]
});

window.onload = async () => {
    await WriteMessage();
}

client.connect();

client.on('message', (channel, tags, message, self) => {
	
});

var Current_Message = null;
var CurrentTextCompletion = "";
var MessagesQueue = [];

client.on('message', (channel, tags, message, self) => {
    message = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    MessagesQueue.push({
        "author": tags['display-name'],
        "author_color": tags['color'],
        "text": "<span><span style='color: " + tags['color'] + ";'>" + tags['display-name'] + ": </span>" + message + "</span>"
    });
});

async function GetMessages() {
    if (MessagesQueue.length > 0) {
        Current_Message = MessagesQueue[0];
        MessagesQueue.shift();
    }
    return Current_Message;
}

async function WriteMessage()
{
    var SkipTheSleep = false;
    while (true)
    {
        if (Current_Message == null)
        {
            Current_Message = await GetMessages();
            CurrentTextCompletion = "";
            await sleep(100);
            continue;
        }

        if (CurrentTextCompletion.length < Current_Message.text.length && Current_Message)
        {
            switch (Current_Message.text[CurrentTextCompletion.length])
            {
                case "<":
                    SkipTheSleep = true;
                    break;
                case ">":
                    SkipTheSleep = false;
                    break;
                default:
                    break;
            }

            CurrentTextCompletion += Current_Message.text[CurrentTextCompletion.length];
            document.getElementById("chatter-message").innerHTML = CurrentTextCompletion;
        }
        else
        {
            sleep(3000);
            Current_Message = null;
        }

        if(!SkipTheSleep)
            await sleep(100);    
    }
}

async function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}