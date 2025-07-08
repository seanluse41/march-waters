// src/lib/helpers/getProductLink.js

export function getProductLink(courseOrSummary) {
  if (!courseOrSummary) return null;
  
  const course = courseOrSummary.toLowerCase();
  
  // Childcare services
  if (course.includes('通常コース') || course.includes('standard care')) {
    return import.meta.env.VITE_STRIPE_CHILDCARE_WITH_MEAL;
  }
  
  if (course.includes('アレルギー対応コース') || course.includes('allergy-friendly care')) {
    return import.meta.env.VITE_STRIPE_CHILDCARE_NO_MEAL;
  }
  
  // Consultation services
  if (course.includes('メール相談') || course.includes('email consultation')) {
    return import.meta.env.VITE_STRIPE_CONSULT_EMAIL;
  }
  
  if (course.includes('じっくり相談') || course.includes('in-depth consultation') || course.includes('60分')) {
    return import.meta.env.VITE_STRIPE_CONSULT_60MIN;
  }
  
  if (course.includes('さくっと相談') || course.includes('quick consultation') || course.includes('30分')) {
    return import.meta.env.VITE_STRIPE_CONSULT_30MIN;
  }
  
  return null;
}