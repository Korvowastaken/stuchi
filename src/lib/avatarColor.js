const colors = ["#18373D", "#ACAB45", "#893A1A"]

// Derived from the id so a chat keeps the same colour across renders and pages
export const avatarColor = (id) =>
    colors[[...String(id)].reduce((sum, c) => sum + c.charCodeAt(0), 0) % colors.length]
