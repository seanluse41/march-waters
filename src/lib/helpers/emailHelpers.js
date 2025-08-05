// src/lib/helpers/emailHelpers.js

export function formatEventDateTime(start, end) {
    const startDate = new Date(start.dateTime);
    const endDate = new Date(end.dateTime);
    
    const dateStr = startDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    
    const timeStr = `${startDate.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit'
    })} - ${endDate.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit'
    })}`;
    
    return { dateStr, timeStr };
}

export function parseEventDescription(description) {
    const lines = description.split('\n');
    const details = {};
    lines.forEach(line => {
        if (line.includes(':')) {
            const [key, value] = line.split(':').map(s => s.trim());
            details[key] = value;
        }
    });
    return details;
}

export function validateEmail(email) {
    if (!email) return ""; // Allow empty for now, required validation handled elsewhere
    
    // More strict email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Additional checks for edge cases
    if (!emailRegex.test(email) || 
        email.includes('..') || 
        email.includes('@.') || 
        email.includes('.@') ||
        email.includes('{}') ||
        email.includes('*') ||
        email.includes('`') ||
        email.includes('+{') ||
        email.includes('}')) {
        return "Please enter a valid email address";
    }
    return "";
}