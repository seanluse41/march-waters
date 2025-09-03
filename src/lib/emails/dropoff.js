import { formatEventDateTime, parseEventDescription } from '$lib/helpers/emailHelpers.js';
import { getProductLink } from '$lib/helpers/getProductLink.js';

export function dropoffEmailTemplate(eventData, eventId = null) {
    const { summary, description, start, end } = eventData;
    const details = parseEventDescription(description);
    const { dateStr, timeStr } = formatEventDateTime(start, end);

    const paymentMethod = details['お支払い方法'] || '';
    const course = details['コース'] || '';
    const isCashPayment = paymentMethod.includes('現金');

    let paymentSection = '';
    if (!isCashPayment) {
        const paymentLink = getProductLink(course, eventId);
        if (paymentLink) {
            paymentSection = `
【お支払いについて】
以下のリンクからオンライン決済をお願いします：
${paymentLink}
`;
        }
    } else {
        paymentSection = `
【お支払いについて】
当日、現金にてお支払いください。
`;
    }

    return `
予約確定のお知らせ

${details['お名前'] || 'お客様'}　様

この度は、March Watersの託児サービス（お預かり型）をご利用いただき、誠にありがとうございます。
下記の通り、ご予約を確定いたしました。

【予約内容】
サービス名: ${summary}
日時: ${dateStr} ${timeStr}
お名前: ${details['お名前'] || ''}
メールアドレス: ${details['メールアドレス'] || ''}
電話番号: ${details['電話番号'] || ''}
コース: ${course}
子供の人数: ${details['子供の人数'] || ''}
お支払い方法: ${paymentMethod}
${paymentSection}
当日は上記の日時にお待ちしております。
お子様のお預かりの準備を整えてお迎えいたします。

ご不明な点やご質問がございましたら、お気軽にお問い合わせください。

今後ともMarch Watersをよろしくお願いいたします。

March Waters
Email: talk@march-waters.com
    `;
}