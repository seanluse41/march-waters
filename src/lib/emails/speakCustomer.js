// src/lib/emails/speakCustomer.js
export function speakCustomerEmailTemplate(requestData) {
    const { name, email, phone, preferredDate, notes } = requestData;
    
    const dateDisplay = preferredDate ? new Date(preferredDate).toLocaleDateString('ja-JP') : '未指定';

    return `
性教育講座開催のお問い合わせありがとうございます

${name}　様

この度は、March Watersの「性教育講座開催」にお問い合わせいただき、誠にありがとうございます。

以下の内容でお問い合わせを承りました。

【お問い合わせ内容】
お名前: ${name}
メールアドレス: ${email}
電話番号: ${phone}
希望日: ${dateDisplay}
${notes ? `追加メモ: ${notes}` : ''}

2〜3営業日以内にメールにてご連絡いたします。
ご不明な点がございましたら、お気軽にお問い合わせください。

今後ともMarch Watersをよろしくお願いいたします。

March Waters
Email: talk@march-waters.com
    `;
}