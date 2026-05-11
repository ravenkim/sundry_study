import React, { useEffect, useState } from "react";
import "./Chat.scss";
import moment from "moment";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";

const Chat = () => {
  const chatData = [
    {
      sender: "컴퓨터",
      content: "안녕하세요 ?",
      chatTime: "2020-11-27 11:20:29",
    },
    {
      sender: "컴퓨터",
      content: "처음 뵙겠습니다.",
      chatTime: "2020-11-27 11:20:40",
    },
    {
      sender: "송재익",
      content: "안녕하세요 ?",
      chatTime: "2020-11-27 11:21:50",
    },
    {
      sender: "송재익",
      content: "못생기셨네요",
      chatTime: "2020-11-27 11:22:01",
    },
    {
      sender: "컴퓨터",
      content: "뭐라구요 ?",
      chatTime: "2020-11-27 11:23:50",
    },
    {
      sender: "송재익",
      content: "잠들었어요",
      chatTime: "2020-11-28 06:22:01",
    },
    {
      sender: "컴퓨터",
      content: "그럴줄 알았음",
      chatTime: "2020-11-29 11:23:50",
    },
    {
      sender: "컴퓨터",
      content: "ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ",
      chatTime: "2020-11-29 11:23:52",
    },
    {
      sender: "컴퓨터",
      content: "즐",
      chatTime: "2020-11-29 11:24:50",
    },
    {
      sender: "송재익",
      content: "????",
      chatTime: "2020-11-29 11:25:50",
    },
    {
      sender: "컴퓨터",
      content: "?????",
      chatTime: "2020-11-29 11:25:50",
    },
  ];

  return (
    <section className="chat">
      <header className="chat-header">
        <h2>
          {/* <span class="name in">홍</span>홍길동 */}
          채팅방
        </h2>
      </header>
      <section className="chat-wrap">
        {chatData &&
          chatData.map((message, idx) => {
            let isMyChat = message.sender === "송재익";
            let isSenderSame = false;
            let isTimeSame = false;
            let isDateSame = false;
            if (idx !== 0) {
              if (message.sender === chatData[idx - 1].sender) {
                isSenderSame = true;
              }

              if (
                moment(message.chatTime).format("YYYYMMDDHHmm") ===
                moment(chatData[idx - 1].chatTime).format("YYYYMMDDHHmm")
              ) {
                isTimeSame = true;
              }

              if (
                moment(message.chatTime).format("YYYYMMDD") ===
                moment(chatData[idx - 1].chatTime).format("YYYYMMDD")
              ) {
                isDateSame = true;
              }
            }

            let chatDate = moment(message.chatTime);
            let day = null;
            switch (chatDate.day()) {
              case 0:
                day = " 일요일";
                break;
              case 1:
                day = " 월요일";
                break;
              case 2:
                day = " 화요일";
                break;
              case 3:
                day = " 수요일";
                break;
              case 4:
                day = " 목요일";
                break;
              case 5:
                day = " 금요일";
                break;
              case 6:
                day = " 토요일";
                break;

              default:
                day = null;
                break;
            }

            return (
              <React.Fragment key={idx}>
                {!isDateSame && (
                  <div key={"chat_date" + idx} className={"chat-date"}>
                    <div key={"chat_item" + idx}>
                      {moment(message.chatTime).format("YYYY년 MM월 DD일") +
                        day}
                    </div>
                  </div>
                )}
                <ChatBox
                  key={idx}
                  isMyChat={isMyChat}
                  isSenderSame={isSenderSame}
                  isTimeSame={isTimeSame}
                  message={message}
                />
              </React.Fragment>
            );
          })}
      </section>
      <ChatInput />
    </section>
  );
};

export default Chat;
