import React, { useEffect, useState } from "react";
import UserAvatar from "./UserAvatar";
import MessageBox from "./MessageBox";
const ChatBox = ({ isMyChat, isSenderSame, isTimeSame, message }) => {
  const [avatarName, setAvatarName] = useState();
  useEffect(() => {
    if (message && message.sender) {
      setAvatarName(message.sender.substring(0, 1));
    }
  }, [message]);

  return (
    <div
      className={
        isMyChat
          ? isSenderSame
            ? "chat-self chat-same-user"
            : "chat-self"
          : isSenderSame
          ? "chat-user chat-same-user"
          : "chat-user"
      }
    >
      {!isMyChat && !isSenderSame && <UserAvatar name={avatarName} />}
      <MessageBox
        message={message}
        isSenderSame={isSenderSame}
        isTimeSame={isTimeSame}
      />
    </div>
  );
};

export default ChatBox;
