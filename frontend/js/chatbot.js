const Chatbot = {
  isOpen: false,
  history: [],
  isTyping: false,

  init() {
    const widget = document.getElementById('chatbot-widget');
    if (!widget) return;

    widget.innerHTML = `
      <div class="chatbot-panel" id="chatbot-panel">
        <div class="chatbot-header">
          <div>
            <h6>Sanskriti Assistant</h6>
            <small style="opacity:0.8">Powered by AI</small>
          </div>
          <button class="btn btn-sm text-white" onclick="Chatbot.close()" aria-label="Close chat">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages">
          <div class="chat-message bot">
            Namaste! Welcome to Sanskriti Market. I can help you discover handcrafted treasures from across India. What are you looking for today?
          </div>
        </div>
        <div class="chatbot-input">
          <input type="text" id="chatbot-input" placeholder="Ask about crafts, products..." 
            onkeypress="if(event.key==='Enter')Chatbot.send()">
          <button onclick="Chatbot.send()" aria-label="Send message">
            <i class="bi bi-send"></i>
          </button>
        </div>
      </div>
      <button class="chatbot-toggle" onclick="Chatbot.toggle()" aria-label="Open chat assistant">
        <i class="bi bi-chat-dots"></i>
      </button>
    `;
  },

  toggle() {
    this.isOpen = !this.isOpen;
    document.getElementById('chatbot-panel')?.classList.toggle('open', this.isOpen);
    if (this.isOpen) document.getElementById('chatbot-input')?.focus();
  },

  close() {
    this.isOpen = false;
    document.getElementById('chatbot-panel')?.classList.remove('open');
  },

  addMessage(content, role) {
    const container = document.getElementById('chatbot-messages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    div.textContent = content;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  showTyping() {
    const container = document.getElementById('chatbot-messages');
    if (!container) return;
    const typing = document.createElement('div');
    typing.className = 'chat-message bot typing-indicator';
    typing.id = 'typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  },

  hideTyping() {
    document.getElementById('typing-indicator')?.remove();
  },

  async send() {
    const input = document.getElementById('chatbot-input');
    const message = input?.value?.trim();
    if (!message || this.isTyping) return;

    input.value = '';
    this.addMessage(message, 'user');
    this.history.push({ role: 'user', content: message });
    this.isTyping = true;
    this.showTyping();

    try {
      const response = await api.ai.chat(message, this.history.slice(-10));
      this.hideTyping();
      const reply = response.data.reply;
      this.addMessage(reply, 'bot');
      this.history.push({ role: 'model', content: reply });
    } catch (error) {
      this.hideTyping();
      this.addMessage("I'm sorry, I couldn't process that. Please try again or browse our collection.", 'bot');
    }

    this.isTyping = false;
  },
};

document.addEventListener('DOMContentLoaded', () => Chatbot.init());
window.Chatbot = Chatbot;
