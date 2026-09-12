const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chat = document.getElementById("chat");

function addMessage(role, content) {
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

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;


}

async function sendMessage() {


    const message = messageInput.value.trim();

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
                message: message
            })
        });


        const data = await response.json();


        addMessage("assistant", data.message);

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
