const dateNumToString = (num, format = 'YMD', sep = '-') => {
  if (!num) return '';
  const ds = num.toString();
  if (format === 'DMY') {
    return `${ds.slice(6, 8)}${sep}${ds.slice(4, 6)}${sep}${ds.slice(0, 4)}`;
  }
  if (format === 'MDY') {
    return `${ds.slice(4, 6)}${sep}${ds.slice(6, 8)}${sep}${ds.slice(0, 4)}`;
  }
  return `${ds.slice(0, 4)}${sep}${ds.slice(4, 6)}${sep}${ds.slice(6, 8)}`;
};

const dateNumFromIsoString = str => {
  if (!str) return 0;
  return Number(str.split('-').join(''));
};

const numerizeDate = str => {
  if (!str) return 0;
  const [day, month, year] = str.split('-');
  const formattedDate = `${year}${month}${day}`;
  return Number(formattedDate);
};

const todayString = () => new Date().toISOString().split('T')[0];

const dateStringFromIsoString = (isoString, format = 'YMD', sep = '-') => {
  const [year, month, day] = isoString.split('-');
  if (format === 'DMY') {
    return [day, month, year].join(sep);
  }
  if (format === 'MDY') {
    return [month, day, year].join(sep);
  }
  return [year, month, day].join(sep);
};

export {
  dateNumToString,
  dateNumFromIsoString,
  todayString,
  dateStringFromIsoString,
  numerizeDate
};
