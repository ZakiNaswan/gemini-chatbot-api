const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

/**
 * Appends a new message to the chat box.
 * @param {string} sender - The sender of the message ('user' or 'bot').
 * @param {string} text - The message content.
 * @returns {HTMLElement} The created message element.
 */
function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  // Scroll to the bottom of the chat box to show the latest message
  chatBox.scrollTop = chatBox.scrollHeight;
  return msgDiv;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) {
    return;
  }

  // 1. Add the user's message to the chat box
  appendMessage('user', userMessage);
  input.value = ''; // Clear the input field

  // 2. Show a temporary "Thinking..." message that we can update later
  const botMessageElement = appendMessage('bot', 'Thinking...');

  try {
    // 3. Send the user's message to the backend API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    // 4. Replace the "Thinking..." message with the AI's actual reply
    if (data && data.result) {
      botMessageElement.textContent = data.result;
    } else {
      botMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Failed to fetch chat response:', error);
    // 5. Show an error message in the bot's message bubble
    botMessageElement.textContent = 'Failed to get response from server.';
  } finally {
    // Ensure the view is scrolled to the bottom again
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
