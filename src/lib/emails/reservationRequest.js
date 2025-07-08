// src/lib/emails/reservationRequest.js
import { formatEventDateTime, parseEventDescription } from '$lib/helpers/emailHelpers.js';

export function reservationRequestEmailTemplate(eventData) {
    const { summary, description, start, end } = eventData;
    const details = parseEventDescription(description);
    const { dateStr, timeStr } = formatEventDateTime(start, end);

    // Handle email consultations (no specific time)
    const isEmailConsult = summary.includes('メール相談');
    const timeDisplay = isEmailConsult ? 'メールでのやりとり' : `${dateStr} ${timeStr}`;

    const course = details['コース'] || summary;
    const paymentMethod = details['お支払い方法'] || '';
    const isCreditPayment = paymentMethod.includes('カード');

    let paymentNotice = '';
    if (isCreditPayment) {
        paymentNotice = `
予約が確定した際の確認メールには決済リンクが含まれます。
予約日までに必ず決済を完了してください。`;
    } else {
        paymentNotice = `
当日、現金にてお支払いください。`;
    }

    return `
予約申請受付のお知らせ

${details['お名前'] || 'お客様'}　様

この度は、March Watersのサービスにお申し込みいただき、誠にありがとうございます。

予約の申請を承りました。スタッフに承認されたら確定となります。

【申請内容】
サービス名: ${summary}
${isEmailConsult ? '対応方法' : '日時'}: ${timeDisplay}
お名前: ${details['お名前'] || ''}
メールアドレス: ${details['メールアドレス'] || ''}
電話番号: ${details['電話番号'] || ''}
コース: ${course}
${details['子供の人数'] ? `子供の人数: ${details['子供の人数']}` : ''}
お支払い方法: ${paymentMethod}

【お支払いについて】
${paymentNotice}

【今後の流れ】
・スタッフによる確認は通常1営業日以内に完了いたします
・予約が確定次第、最終確認メールをお送りいたします
・キャンセルは前日まで承っております
・ご不明な点がございましたら talk@march-waters.com までご連絡ください

予約確定まで今しばらくお待ちください。

March Waters
Email: talk@march-waters.com
    `;
}