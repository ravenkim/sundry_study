import React from "react";

const ChatInput = () => {
  return (
    <footer className="chat-input">
      <form>
        <input type="text" id="chat-input" placeholder="새 메시지 입력" />
        <button type="submit" className="chat-submit" id="chat-submit">
          전송
        </button>
      </form>
    </footer>
  );
};

export default ChatInput;
