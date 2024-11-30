function formatDateAndTime(isoString:any) {
  const date = new Date(isoString);

  if (isNaN(date)) {
      return '';
  }

  const day = date.getUTCDate().toString().padStart(2, '0'); 
  const monthOptions = { month: 'short' };
  const month = date.toLocaleString('en-US', { ...monthOptions, timeZone: 'UTC' });
  const year = date.getUTCFullYear(); 

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedTime = `${(hours % 12) || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;

  return {
    date: `${day} ${month} ${year}`,
    time: formattedTime
  }
}

export default formatDateAndTime;
