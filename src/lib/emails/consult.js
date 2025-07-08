// src/lib/emails/consult.js
import { formatEventDateTime, parseEventDescription } from '$lib/helpers/emailHelpers.js';
import { getProductLink } from '$lib/helpers/getProductLink.js';

export function consultationEmailTemplate(eventData) {
    const { summary, description, start, end } = eventData;
    const details = parseEventDescription(description);
    const { dateStr, timeStr } = formatEventDateTime(start, end);

    // Handle email consultations (no specific time)
    const isEmailConsult = summary.includes('メール相談');
    const timeDisplay = isEmailConsult ? 'メールでのやりとり' : `${dateStr} ${timeStr}`;

    const course = details['コース'] || summary;
    const paymentLink = getProductLink(course);
    
    let paymentSection = '';
    if (paymentLink) {
        paymentSection = `
【お支払いについて】
以下のリンクからオンライン決済をお願いします：
${paymentLink}
`;
    }

    return `
相談予約確認のお知らせ

${details['お名前'] || 'お客様'}　様

この度は、March Watersの「じょさんしとはなそう」サービスをご利用いただき、誠にありがとうございます。
下記の通り、ご予約を確認いたしました。

【予約内容】
サービス名: ${summary}
${isEmailConsult ? '対応方法' : '日時'}: ${timeDisplay}
お名前: ${details['お名前'] || ''}
メールアドレス: ${details['メールアドレス'] || ''}
電話番号: ${details['電話番号'] || ''}
コース: ${course}
お支払い方法: ${details['お支払い方法'] || ''}
${paymentSection}${!isEmailConsult ? `
【Google Meetリンク】
https://meet.google.com/cqj-jtmg-gau

当日は上記の日時に、Google Meetリンクからご参加ください。
` : ''}

${isEmailConsult 
    ? 'メールでのご相談内容を確認後、24時間以内にご返信いたします。' 
    : '上記のGoogle Meetリンクからオンライン相談にご参加いただけます。'
}

ご不明な点やご質問がございましたら、お気軽にお問い合わせください。

今後ともMarch Watersをよろしくお願いいたします。

March Waters
Email: talk@march-waters.com
    `;
}