// src/lib/emails/reservationRequest.js
import { formatEventDateTime, parseEventDescription } from '$lib/helpers/emailHelpers.js';

function getServiceType(summary) {
  if (summary.includes('訪問型')) {
    return 'babysitter';
  } else if (summary.includes('お預かり')) {
    return 'dropoff';
  } else {
    return 'consultation';
  }
}

function getServiceName(serviceType) {
  switch (serviceType) {
    case 'babysitter':
      return '訪問型託児サービス';
    case 'dropoff':
      return 'お預かり型託児サービス';
    default:
      return '妊娠相談・育児相談';
  }
}

export function reservationRequestEmailTemplate(eventData) {
  const { summary, description, start, end } = eventData;
  const details = parseEventDescription(description);
  const { dateStr, timeStr } = formatEventDateTime(start, end);

  const serviceType = getServiceType(summary);
  const serviceName = getServiceName(serviceType);
  
  // Handle email consultations (no specific time)
  const isEmailConsult = summary.includes('メール相談');
  const timeDisplay = isEmailConsult ? 'メールでのやりとり' : `${dateStr} ${timeStr}`;

  const course = details['コース'] || summary;
  const paymentMethod = details['お支払い方法'] || '';
  const isCreditPayment = paymentMethod.includes('カード');

  const paymentNotice = isCreditPayment 
    ? `予約が確定した際の確定メールには決済リンクが含まれます。\n予約日までに必ず決済を完了してください。`
    : `当日、現金にてお支払いください。`;

  return `
予約申請受付のお知らせ

${details['お名前'] || 'お客様'}　様

この度は、March Watersのサービスにお申し込みいただき、誠にありがとうございます。

予約の申請を承りました。スタッフに承認されたら確定となりますので、ご連絡をお待ち下さい。

【申請内容】
サービス名: ${serviceName}
${isEmailConsult ? '対応方法' : '日時'}: ${timeDisplay}
お名前: ${details['お名前'] || ''}
メールアドレス: ${details['メールアドレス'] || ''}
電話番号: ${details['電話番号'] || ''}
${serviceType === 'babysitter' && details['住所'] ? `住所: ${details['住所']}` : ''}
コース: ${course}
${details['子供の人数'] ? `子供の人数: ${details['子供の人数']}` : ''}
お支払い方法: ${paymentMethod}

【お支払いについて】
${paymentNotice}

【今後の流れ】
・スタッフによる確認は通常1営業日以内に完了いたします
・予約が確定次第、最終確定メールをお送りいたします
・キャンセルは前日まで承っております
・ご不明な点がございましたら talk@march-waters.com までご連絡ください

予約確定まで今しばらくお待ちください。

March Waters
Email: talk@march-waters.com
    `;
}