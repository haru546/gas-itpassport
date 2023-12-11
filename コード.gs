'use strict'

// LINE Messaging API用のチャネルアクセストークン
const LINE_CHANNEL_ACCESS_TOKEN = "1jDxw9Mh7UxeTeavRcsXms/WmfR9RfeO5IwyWvxX8MmWWjMesqb8ioL7jnJLLujeI7EaQLhQLMZauaF01d2tn6DH/Jq46pgJ9qr3MZBkss2ARxrNKYa7GaELkXTmxtWXKPS1rDAl9jkUoF+D0arx9QdB04t89/1O/w1cDnyilFU=";

// Google SpreadsheetのスプレッドシートID
const SPREADSHEET_ID = "1bw0auUTUnH-6wN41p_ZvXZm8Z0HY4o8jRtHZN34Bjf8";

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