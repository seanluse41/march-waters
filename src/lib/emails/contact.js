// src/lib/emails/contact.js

export function contactEmailTemplate(contactData) {
    const { name, email, phone, reasons, otherReason, message } = contactData;
    
    // Convert reasons to Japanese labels
    const reasonLabels = [];
    if (reasons.childcare) reasonLabels.push('託児サービス');
    if (reasons.bodyChoice) reasonLabels.push('性教育講座開催');
    if (reasons.midwife) reasonLabels.push('妊娠相談・育児相談');
    if (reasons.event) reasonLabels.push('イベント予約');
    if (reasons.other) reasonLabels.push(`その他: ${otherReason || '詳細なし'}`);

    return `
お問い合わせを受信しました

ウェブサイトのお問い合わせフォームから新しいメッセージが届きました。

【お問い合わせ内容】
お名前: ${name}
メールアドレス: ${email}
電話番号: ${phone}
お問い合わせ内容: ${reasonLabels.join(', ') || 'なし'}

【メッセージ】
${message || 'メッセージなし'}

---
送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
送信元: ウェブサイトお問い合わせフォーム
    `;
}