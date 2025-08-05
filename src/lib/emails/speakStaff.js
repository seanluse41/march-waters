// src/lib/emails/speakStaff.js
export function speakStaffEmailTemplate(requestData) {
    const { name, email, phone, preferredDate, notes } = requestData;
    
    const dateDisplay = preferredDate ? new Date(preferredDate).toLocaleDateString('ja-JP') : '未指定';

    return `
性教育講座開催のお問い合わせが届きました

ウェブサイトから性教育講座開催のお問い合わせが届きました。

【お問い合わせ詳細】
お名前: ${name}
メールアドレス: ${email}
電話番号: ${phone}
希望日: ${dateDisplay}
${notes ? `追加メモ: ${notes}` : ''}

このメールアドレスに直接返信してお客様とのやりとりを開始してください: ${email}

---
送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
送信元: ウェブサイト性教育講座開催フォーム
    `;
}