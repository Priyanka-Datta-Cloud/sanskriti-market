// Sanskriti Market AI Chatbot
(function() {
  const SUGGESTED = [
    'Tell me about Madhubani art',
    'What is genuine Pashmina?',
    'Find a gift under ₹2000',
    'Tell me about Indian spices',
    'What crafts are from Rajasthan?',
  ];

  function init() {
    // Add chatbot CSS
    const style = document.createElement('style');
    style.textContent = `
      #sm-chatbot { position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: 'Inter', sans-serif; }
      #sm-chat-btn { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #8B2942, #C9A962); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(139,41,66,0.4); transition: all .3s; font-size: 1.4rem; }
      #sm-chat-btn:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(139,41,66,0.5); }
      #sm-panel { position: fixed; bottom: 90px; right: 24px; width: 360px; max-height: 520px; background: #fff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); display: none; flex-direction: column; overflow: hidden; border: 1px solid #f0e8e0; }
      #sm-panel.open { display: flex; animation: slideUp .3s ease; }
      @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      #sm-chat-header { background: linear-gradient(135deg, #8B2942, #6d1f33); padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; }
      #sm-chat-header .hinfo { display: flex; align-items: center; gap: 10px; }
      #sm-chat-header .havatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(201,169,98,0.3); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
      #sm-chat-header h6 { color: #fff; margin: 0; font-size: 0.9rem; font-weight: 600; }
      #sm-chat-header small { color: rgba(255,255,255,0.7); font-size: 0.72rem; }
      #sm-close-btn { background: none; border: none; color: rgba(255,255,255,0.8); cursor: pointer; font-size: 1.1rem; padding: 4px; }
      #sm-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #FAFAFA; }
      .sm-msg { max-width: 85%; padding: 10px 14px; border-radius: 16px; font-size: 0.87rem; line-height: 1.5; }
      .sm-msg.bot { background: #fff; border: 1px solid #f0e8e0; color: #333; border-radius: 4px 16px 16px 16px; align-self: flex-start; }
      .sm-msg.user { background: #8B2942; color: #fff; border-radius: 16px 4px 16px 16px; align-self: flex-end; }
      .sm-msg.typing { background: #fff; border: 1px solid #f0e8e0; color: #999; font-style: italic; }
      #sm-suggestions { padding: 10px 14px; display: flex; gap: 6px; flex-wrap: wrap; border-top: 1px solid #f0e8e0; background: #fff; }
      .sm-suggestion { font-size: 11px; padding: 5px 10px; border-radius: 20px; background: #F5F0E8; color: #8B2942; border: 1px solid #e8ddd0; cursor: pointer; transition: all .2s; white-space: nowrap; }
      .sm-suggestion:hover { background: #8B2942; color: #fff; }
      #sm-input-area { padding: 12px 14px; border-top: 1px solid #f0e8e0; background: #fff; display: flex; gap: 8px; }
      #sm-input { flex: 1; border: 1.5px solid #e8ddd0; border-radius: 25px; padding: 9px 14px; font-size: 0.87rem; outline: none; font-family: inherit; }
      #sm-input:focus { border-color: #8B2942; }
      #sm-send { background: #8B2942; color: #fff; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s; flex-shrink: 0; }
      #sm-send:hover { background: #6d1f33; }
      .sm-notification { position: absolute; top: -4px; right: -4px; width: 18px; height: 18px; background: #C9A962; border-radius: 50%; font-size: 10px; font-weight: 700; color: #1a0a0f; display: flex; align-items: center; justify-content: center; }
    `;
    document.head.appendChild(style);

    // Add chatbot HTML
    const div = document.createElement('div');
    div.id = 'sm-chatbot';
    div.innerHTML = `
      <div id="sm-panel">
        <div id="sm-chat-header">
          <div class="hinfo">
            <div class="havatar">🪔</div>
            <div>
              <h6>Sanskriti AI Guide</h6>
              <small>Ask about crafts, gifts, spices & more</small>
            </div>
          </div>
          <button id="sm-close-btn" onclick="SMChat.close()">✕</button>
        </div>
        <div id="sm-messages">
          <div class="sm-msg bot">Namaste! 🙏 I'm your Sanskriti heritage guide. Ask me about Indian crafts, find the perfect gift, or learn about our spices and food!</div>
        </div>
        <div id="sm-suggestions">
          ${SUGGESTED.map(s => `<span class="sm-suggestion" onclick="SMChat.sendMsg('${s}')">${s}</span>`).join('')}
        </div>
        <div id="sm-input-area">
          <input id="sm-input" type="text" placeholder="Ask about Indian crafts..." onkeypress="if(event.key==='Enter')SMChat.send()">
          <button id="sm-send" onclick="SMChat.send()">➤</button>
        </div>
      </div>
      <button id="sm-chat-btn" onclick="SMChat.toggle()">
        <span id="sm-icon">💬</span>
        <span class="sm-notification" id="sm-notif">1</span>
      </button>
    `;
    document.body.appendChild(div);
  }

  window.SMChat = {
    isOpen: false,
    isTyping: false,

    toggle() {
      this.isOpen = !this.isOpen;
      const panel = document.getElementById('sm-panel');
      if (panel) panel.classList.toggle('open', this.isOpen);
      document.getElementById('sm-icon').textContent = this.isOpen ? '✕' : '💬';
      const notif = document.getElementById('sm-notif');
      if (notif) notif.style.display = 'none';
      if (this.isOpen) document.getElementById('sm-input')?.focus();
    },

    close() {
      this.isOpen = false;
      document.getElementById('sm-panel')?.classList.remove('open');
      document.getElementById('sm-icon').textContent = '💬';
    },

    addMsg(text, role) {
      const container = document.getElementById('sm-messages');
      if (!container) return;
      const div = document.createElement('div');
      div.className = `sm-msg ${role}`;
      div.textContent = text;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
      return div;
    },

    async sendMsg(text) {
      if (!text?.trim() || this.isTyping) return;
      document.getElementById('sm-input').value = '';
      this.addMsg(text, 'user');
      document.getElementById('sm-suggestions').style.display = 'none';
      this.isTyping = true;
      const typingDiv = this.addMsg('Thinking...', 'bot typing');
      try {
        const res = await fetch('/api/ai/heritage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });
        const data = await res.json();
        typingDiv.remove();
        this.addMsg(data.response || 'I\'m here to help! Ask me anything about Indian crafts.', 'bot');
      } catch (e) {
        typingDiv.remove();
        this.addMsg('Sorry, I couldn\'t connect right now. Please try again in a moment!', 'bot');
      }
      this.isTyping = false;
    },

    send() {
      const input = document.getElementById('sm-input');
      const text = input?.value?.trim();
      if (text) this.sendMsg(text);
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
