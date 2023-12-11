'use strict'

// LINEチャネルアクセストークン
const channelAccessToken = "my token";

// LINE Messaging APIからのリクエストを処理する関数
function doPost(e) {
  let json = JSON.parse(e.postData.contents);
  let replyToken = json.events[0].replyToken;

  // Google SheetsのIDとシート名
  const spreadsheetId = "my sheet";
  const sheetName = "単語";

  // Google Sheetsからのデータ取得
  let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName(sheetName);
  let lastRow = sheet.getLastRow();
  let dataRange = sheet.getRange(2, 1, lastRow - 1, 3); // A列からC列までのデータを取得
  let data = dataRange.getValues();

  //ユーザーが選択肢を返信してくれた場合の処理
  // メッセージの種類が postback の場合を処理
  if (json.events[0].type === "postback") {
    let postbackData = json.events[0].postback.data; // ボタンがクリックされたときのデータ

    // "action=select&value=xxx&value2=yyy" のような形式を持つデータから value と value2 を取り出す
    let actionValuePairs = postbackData.split("&");
    let selectedValue = "";
    let selectedValue2 = "";
    for (let i = 0; i < actionValuePairs.length; i++) {
      let pair = actionValuePairs[i].split("=");
      if (pair[0] === "value") {
        selectedValue = pair[1];
      } else if (pair[0] === "value2") {
        selectedValue2 = pair[1];
      }
    }

    // ユーザーへの返信メッセージの作成
    let replyText = "";
    if (selectedValue2 === "※引用；ぽんぱすより") {
      replyText = selectedValue + selectedValue2;
    } else {
      replyText = selectedValue;
    }

    // メッセージを返信するためのコード
    let replyPayload = {
      "replyToken": replyToken,
      "messages": [
        {
          "type": "text",
          "text": replyText
        }
      ]
    };

    let replyOptions = {
      "method": "post",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + channelAccessToken,
      },
      "payload": JSON.stringify(replyPayload)
    };

    // LINE Messaging APIにリクエストを送信してメッセージを返信
    let replyResponse = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", replyOptions);

  } else {

    // 部分一致する行を探す
    let matchingRows =[];
    for(let i = 0; i <data.length; i++) {
    let userMessage = json.events[0].message.text;
    if (data[i][0].indexOf(userMessage) !== -1) {
      matchingRows.push(data[i]);
    }
  }

  let messages = [];

  if (matchingRows.length > 0) {
    // ボタンメッセージの作成
    let buttonMessages = [];
    for (let i = 0; i < matchingRows.length; i++) {
      let optionText = matchingRows[i][0]; // 部分一致したテキストを取得
      let optionValue = matchingRows[i][1]; // B列の値を取得
      let optionValue2 = matchingRows[i][2]; // C列の値を取得

      let buttonTemplate = {
        "type": "postback",
        "label": optionText,
        "data": "action=select&value=" + optionValue + "&value2=" + optionValue2
      };

      buttonMessages.push(buttonTemplate);
    }

    messages.push({
      "type": "template",
      "altText": "選択肢を選んでください",
      "template": {
        "type": "buttons",
        "text": "以下から選んでください",
        "actions": buttonMessages
      }
    });

    messages.push({
      "type": "text",
      "text": "上記になければ、こちらをご活用ください。"
    });

    messages.push({
      "type": "text",
      "text": "https://wa3.i-3-i.info/"
    });

  } else {
    messages.push({
      "type": "text",
      "text": "用語が登録されていません。こちらをご活用ください。"
    });

    messages.push({
      "type": "text",
      "text": " https://wa3.i-3-i.info/"
    });
  }

  // メッセージを含むオブジェクトを作成
  let payload = {
    "replyToken": replyToken,
    "messages": messages
  };

  let options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + channelAccessToken,
    },
    "payload": JSON.stringify(payload)
  };

  // LINE Messaging APIにリクエストを送信
  let response = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
  }
}
