// src/lib/helpers/getProductLink.js

const DROPOFF_WITH_MEAL = import.meta.env.VITE_STRIPE_DROPOFF_WITH_MEAL;
const DROPOFF_NO_MEAL = import.meta.env.VITE_STRIPE_DROPOFF_NO_MEAL;
const CONSULT_EMAIL = import.meta.env.VITE_STRIPE_CONSULT_EMAIL;
const CONSULT_60MIN = import.meta.env.VITE_STRIPE_CONSULT_60MIN;
const CONSULT_30MIN = import.meta.env.VITE_STRIPE_CONSULT_30MIN;
const BABYSITTER = import.meta.env.VITE_STRIPE_BABYSITTER;


export function getProductLink(courseOrSummary, eventId = null) {
  if (!courseOrSummary) return null;
  
  const course = courseOrSummary.toLowerCase();
  let baseUrl = null;
  
  // Map specific course IDs
  if (course.includes('dropoff-dinner')) {
    baseUrl = DROPOFF_WITH_MEAL;
  } else if (course.includes('dropoff-nodinner')) {
    baseUrl = DROPOFF_NO_MEAL;
  } else if (course.includes('babysitter')) {
    baseUrl = BABYSITTER;
  }
  // Consultation services
  else if (course.includes('メール相談') || course.includes('email consultation')) {
    baseUrl = CONSULT_EMAIL;
  } else if (course.includes('じっくり相談') || course.includes('in-depth consultation') || course.includes('60分')) {
    baseUrl = CONSULT_60MIN;
  } else if (course.includes('さくっと相談') || course.includes('quick consultation') || course.includes('30分')) {
    baseUrl = CONSULT_30MIN;
  }
  
  if (!baseUrl) return null;
  
  // Append event ID as client_reference_id if provided
  if (eventId) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}client_reference_id=${eventId}`;
  }
  
  return baseUrl;
}