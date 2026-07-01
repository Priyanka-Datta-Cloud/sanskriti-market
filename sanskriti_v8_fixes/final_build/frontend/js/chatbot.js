(function() {
  // Customer-focused suggested questions
  const SUGGESTED = [
    'Is this product authentic?',
    'How do I identify real Pashmina?',
    'What gift should I buy under ₹2000?',
    'How long does shipping take?',
    'What is Madhubani art?',
    'Are your spices natural and fresh?',
    'Can I return a product?',
    'Which craft is best for home decor?',
  ];

  function init() {
    const style = document.createElement('style');
    style.textContent = `
      #sm-chatbot{position:fixed;bottom:24px;right:24px;z-index:9999;font-family:'Inter',sans-serif}
      #sm-chat-btn{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#8B2942,#C9A962);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(139,41,66,0.45);transition:all .3s;font-size:1.5rem}
      #sm-chat-btn:hover{transform:scale(1.12);box-shadow:0 6px 28px rgba(139,41,66,0.55)}
      #sm-panel{position:fixed;bottom:92px;right:24px;width:370px;max-height:540px;background:#fff;border-radius:22px;box-shadow:0 20px 60px rgba(0,0,0,0.18);display:none;flex-direction:column;overflow:hidden;border:1px solid #f0e8e0}
      #sm-panel.open{display:flex;animation:slideUp .3s ease}
      @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      #sm-header{background:linear-gradient(135deg,#8B2942,#6d1f33);padding:16px 18px;display:flex;align-items:center;justify-content:space-between}
      .sm-hinfo{display:flex;align-items:center;gap:10px}
      .sm-havatar{width:38px;height:38px;border-radius:50%;background:rgba(201,169,98,0.3);display:flex;align-items:center;justify-content:center;font-size:1.2rem}
      #sm-header h6{color:#fff;margin:0;font-size:0.92rem;font-weight:600}
      #sm-header small{color:rgba(255,255,255,0.7);font-size:0.72rem}
      #sm-close{background:none;border:none;color:rgba(255,255,255,0.8);cursor:pointer;font-size:1.1rem;padding:4px}
      #sm-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#FAFAFA}
      .sm-msg{max-width:86%;padding:10px 14px;border-radius:16px;font-size:0.87rem;line-height:1.55}
      .sm-msg.bot{background:#fff;border:1px solid #f0e8e0;color:#333;border-radius:4px 16px 16px 16px;align-self:flex-start}
      .sm-msg.user{background:#8B2942;color:#fff;border-radius:16px 4px 16px 16px;align-self:flex-end}
      .sm-msg.typing{background:#fff;border:1px solid #f0e8e0;color:#999;font-style:italic;align-self:flex-start}
      #sm-suggestions{padding:10px 12px;display:flex;gap:6px;flex-wrap:wrap;border-top:1px solid #f0e8e0;background:#fff;max-height:90px;overflow-y:auto}
      .sm-sug{font-size:11px;padding:5px 10px;border-radius:20px;background:#F5F0E8;color:#8B2942;border:1px solid #e8ddd0;cursor:pointer;transition:all .2s;white-space:nowrap}
      .sm-sug:hover{background:#8B2942;color:#fff}
      #sm-input-wrap{padding:12px 14px;border-top:1px solid #f0e8e0;background:#fff;display:flex;gap:8px}
      #sm-input{flex:1;border:1.5px solid #e8ddd0;border-radius:25px;padding:9px 14px;font-size:0.87rem;outline:none;font-family:inherit}
      #sm-input:focus{border-color:#8B2942}
      #sm-send{background:#8B2942;color:#fff;border:none;border-radius:50%;width:38px;height:38px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1rem}
      #sm-send:hover{background:#6d1f33}
      .sm-notif{position:absolute;top:-4px;right:-4px;width:18px;height:18px;background:#C9A962;border-radius:50%;font-size:10px;font-weight:700;color:#1a0a0f;display:flex;align-items:center;justify-content:center}
    `;
    document.head.appendChild(style);

    const div = document.createElement('div');
    div.id = 'sm-chatbot';
    div.innerHTML = `
      <div id="sm-panel">
        <div id="sm-header">
          <div class="sm-hinfo">
            <div class="sm-havatar">🪔</div>
            <div>
              <h6>Sanskriti AI Guide</h6>
              <small>Ask me anything about our products</small>
            </div>
          </div>
          <button id="sm-close" onclick="SMChat.close()">✕</button>
        </div>
        <div id="sm-messages">
          <div class="sm-msg bot">Namaste! 🙏 I'm here to help you find authentic Indian products. Ask me about crafts, spices, authenticity, shipping, returns, or gift ideas!</div>
        </div>
        <div id="sm-suggestions">
          ${SUGGESTED.map(s => `<span class="sm-sug" onclick="SMChat.send('${s}')">${s}</span>`).join('')}
        </div>
        <div id="sm-input-wrap">
          <input id="sm-input" type="text" placeholder="Ask anything..." onkeypress="if(event.key==='Enter')SMChat.sendInput()">
          <button id="sm-send" onclick="SMChat.sendInput()">➤</button>
        </div>
      </div>
      <button id="sm-chat-btn" onclick="SMChat.toggle()" style="position:relative">
        <span id="sm-icon">💬</span>
        <span class="sm-notif" id="sm-notif">1</span>
      </button>
    `;
    document.body.appendChild(div);
  }

  window.SMChat = {
    isOpen: false,
    busy: false,

    toggle() {
      this.isOpen = !this.isOpen;
      document.getElementById('sm-panel').classList.toggle('open', this.isOpen);
      document.getElementById('sm-icon').textContent = this.isOpen ? '✕' : '💬';
      const n = document.getElementById('sm-notif');
      if (n) n.style.display = 'none';
      if (this.isOpen) document.getElementById('sm-input')?.focus();
    },

    close() {
      this.isOpen = false;
      document.getElementById('sm-panel')?.classList.remove('open');
      document.getElementById('sm-icon').textContent = '💬';
    },

    addMsg(text, cls) {
      const box = document.getElementById('sm-messages');
      const d = document.createElement('div');
      d.className = 'sm-msg ' + cls;
      d.textContent = text;
      box.appendChild(d);
      box.scrollTop = box.scrollHeight;
      return d;
    },

    sendInput() {
      const inp = document.getElementById('sm-input');
      const txt = inp?.value?.trim();
      if (txt) { inp.value = ''; this.send(txt); }
    },

    async send(text) {
      if (!text || this.busy) return;
      document.getElementById('sm-suggestions').style.display = 'none';
      this.addMsg(text, 'user');
      this.busy = true;
      const typing = this.addMsg('Thinking...', 'bot typing');
      try {
        const res = await fetch('/api/ai/heritage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });
        const data = await res.json();
        typing.remove();
        this.addMsg(data.response || data.data?.response || 'Happy to help! Ask me anything about Indian crafts and products.', 'bot');
      } catch {
        typing.remove();
        this.addMsg('Sorry, having trouble connecting. Please try again!', 'bot');
      }
      this.busy = false;
    },
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
