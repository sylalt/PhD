function parseDateParts(value) {
  const date = String(value ?? '').trim();
  let match = date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (match) {
    return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  }

  match = date.match(/^(\d{1,2})[/. -](\d{1,2})[/. -](\d{2}|\d{4})$/);
  if (!match) return null;

  let year = Number(match[3]);
  if (year < 100) year += 2000;

  return { day: Number(match[1]), month: Number(match[2]), year };
}

function formatDate(value, shortYear = false) {
  const parts = parseDateParts(value);
  if (!parts) return value;

  const { day, month, year } = parts;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return value;
  }

  const formattedYear = shortYear ? String(year).slice(-2) : String(year).padStart(4, '0');
  return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${formattedYear}`;
}

export default formatDate;
