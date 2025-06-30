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
    const timeStr = `${startDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`;
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