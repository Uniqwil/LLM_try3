const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const modelSelect = document.getElementById("modelSelect");
let models = [];

function addMessage(role, content, stats = null) {
    const message = document.createElement("div");


    message.classList.add("message");

    if (role === "user") {
        message.classList.add("user-message");
    } else {
        message.classList.add("assistant-message");
    }


    const roleElement = document.createElement("div");
    roleElement.classList.add("message-role");

    roleElement.textContent = role === "user" ? "You" : "AI";


    const contentElement = document.createElement("div");
    contentElement.classList.add("message-content");

    contentElement.textContent = content;


    message.appendChild(roleElement);
    message.appendChild(contentElement);

    if (role === "assistant" && stats) {
        const selectedModel = models.find(
            model => model.name === stats.model
        );
        const contextLength = selectedModel.details.context_length ?? "Unknown";
        const infoButton = document.createElement("button");

        infoButton.textContent = "ⓘ";
        infoButton.classList.add("info-button");

        const statsElement = document.createElement("div");

        statsElement.classList.add("message-stats");

        statsElement.textContent =
        `Model: ${stats.model}
        Context: ${stats.prompt_tokens} / ${contextLength}
        Generated tokens: ${stats.generated_tokens}
        Generation time: ${stats.generation_time.toFixed(2)} s
        Tokens/sec: ${stats.tokens_per_second.toFixed(2)}
        Total time: ${stats.total_time.toFixed(2)} s`;

        infoButton.addEventListener("click", function() {
            statsElement.classList.toggle("visible");
        });

        message.appendChild(infoButton);
        message.appendChild(statsElement);
    }

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;


}

async function loadModels() {

    try {

        const response = await fetch("/api/models");

        const data = await response.json();
        models = data.models;
        console.log(data); // string for debagging. Delete it latter!

        modelSelect.innerHTML = "";

        for (const model of data.models) {

            const option = document.createElement("option");

            option.value = model.name;
            option.textContent = model.name;

            modelSelect.appendChild(option);
        }
        console.log(modelSelect.options.length); // string for debagging. Delete it latter!

    } catch (error) {

        console.error(error);

        modelSelect.innerHTML =
        "<option>Could not load models</option>";
    }
}


async function sendMessage() {


    const message = messageInput.value.trim();
    const model = modelSelect.value;

    if (!message) {
        return;
    }


    addMessage("user", message);

    messageInput.value = "";


    sendButton.disabled = true;


    try {
        const response = await fetch("/api/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message,
                model: model
            })
        });


        const data = await response.json();
        console.log(data); // only for debugging, delete letter!


        addMessage("assistant", data.message, data.stats);

    } catch (error) {

        console.error(error);

        addMessage(
            "assistant",
            "Error: Could not connect to the server."
        );

    } finally {

        sendButton.disabled = false;

        messageInput.focus();
    }


}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});

loadModels();
