export async function addCalendarEvent(eventDetails) {
  // Skip calendar creation for email consultations
  if (eventDetails.summary === 'メール相談') {
    return {
      success: true,
      event: { summary: 'Email consultation - no calendar event created' }
    };
  }

  try {
    const response = await fetch('/api/update-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventDetails)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create calendar event');
    }
    
    const data = await response.json();
    return {
      success: true,
      event: data.event
    };
    
  } catch (error) {
    console.error('Error adding calendar event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create event data for child-care bookings
 */
export function createChildCareEventData({ selectedDate, name, email, phone, childCount, selectedCourse, paymentMethod }) {
  const startDate = new Date(selectedDate);
  startDate.setHours(17, 0, 0, 0); // 5:00 PM
  
  const endDate = new Date(selectedDate);
  endDate.setHours(21, 30, 0, 0); // 9:30 PM
  
  // Force Japanese text for calendar events
  const paymentJP = paymentMethod === 'cash' ? '現金' : 'カード決済';
  
  const description = [
    `お名前: ${name}`,
    `メールアドレス: ${email}`,
    `電話番号: ${phone}`,
    `コース: ${selectedCourse}`,
    `子供の人数: ${childCount}名`,
    `お支払い方法: ${paymentJP}`,
    'サービス: あとはねるだけプロジェクト (17:00-21:30)'
  ].join('\n');
  
  return {
    summary: 'あとはねるだけプロジェクト',
    description,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'Asia/Tokyo'
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'Asia/Tokyo'
    }
  };
}

/**
 * Create event data for consultation bookings
 */
export function createConsultEventData({ selectedDate, selectedTimeSlot, name, email, phone, selectedCourse, paymentMethod, courseDuration }) {
  const [startHour] = selectedTimeSlot.split(':').map(Number);
  
  const startDate = new Date(selectedDate);
  startDate.setHours(startHour, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setHours(startHour + 1, 0, 0, 0); // Default to 1 hour
  
  // Force Japanese text for calendar events
  const paymentJP = paymentMethod === 'cash' ? '現金' : 'カード決済';
  
  // Determine event title based on course
  let eventTitle = 'じょさんしとはなそう';
  let serviceNameJP = 'オンライン相談';
  
  if (selectedCourse === 'quick') {
    eventTitle = 'さくっと相談 (30分)';
    serviceNameJP = 'さくっと相談 (30分)';
    endDate.setHours(startHour, 30, 0, 0); // 30 minutes
  } else if (selectedCourse === 'indepth') {
    eventTitle = 'じっくり相談 (60分)';
    serviceNameJP = 'じっくり相談 (60分)';
  } else if (selectedCourse === 'email') {
    eventTitle = 'メール相談';
    serviceNameJP = 'メール相談';
    // For email consultations, use all-day event
    return {
      summary: eventTitle,
      description: [
        `お名前: ${name}`,
        `メールアドレス: ${email}`,
        `電話番号: ${phone}`,
        `コース: ${serviceNameJP}`,
        `お支払い方法: ${paymentJP}`,
        'サービス: メール相談'
      ].join('\n'),
      start: {
        date: selectedDate.toISOString().split('T')[0]
      },
      end: {
        date: selectedDate.toISOString().split('T')[0]
      }
    };
  }
  
  const description = [
    `お名前: ${name}`,
    `メールアドレス: ${email}`,
    `電話番号: ${phone}`,
    `コース: ${serviceNameJP}`,
    `時間: ${selectedTimeSlot}`,
    `お支払い方法: ${paymentJP}`,
    `サービス: ${serviceNameJP}`
  ].join('\n');
  
  return {
    summary: eventTitle,
    description,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'Asia/Tokyo'
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'Asia/Tokyo'
    }
  };
}