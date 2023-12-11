'use strict'

// LINE Messaging API用のチャネルアクセストークン
const LINE_CHANNEL_ACCESS_TOKEN = "my token";

// Google SpreadsheetのスプレッドシートID
const SPREADSHEET_ID = "my id";

// LINE Messaging APIからのメッセージを処理する関数
function doPost(e) {
  const contents = JSON.parse(e.postData.contents);
  const replyToken = contents.events[0].replyToken;
  const receivedMessage = contents.events[0].message.text;

  // 受信したメッセージが「てすと」と一致する場合のみ「はい」と返信
  let replyMessage = receivedMessage === "てすと" ? "はい" : "";

  // レスポンスを返信
  replyMessageToLine(replyToken, replyMessage);
}

// LINEに返信メッセージを送信する関数
function replyMessageToLine(replyToken, replyMessage) {
  const url = "https://api.line.me/v2/bot/message/reply";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + LINE_CHANNEL_ACCESS_TOKEN,
  };
  const data = {
    replyToken: replyToken,
    messages: [{ type: "text", text: replyMessage }],
  };

  const options = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(data),
  };
  UrlFetchApp.fetch(url, options);
}
