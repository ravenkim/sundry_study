import React from "react";
import moment from "moment";

const MessageBox = ({ message, isSenderSame, isTimeSame }) => {
  return (
    <div className={"chat-box"}>
      {!isSenderSame && <em className={"fullname"}>{message.sender}</em>}
      {isSenderSame ? !isTimeSame && <span className={"chat-time"}>{moment(message.chatTime).format("HH:mm")}</span> : <span className={"chat-time"}>{moment(message.chatTime).format("HH:mm")}</span>}
      <div>{message.content}</div>
    </div>
  );
};

export default MessageBox;
