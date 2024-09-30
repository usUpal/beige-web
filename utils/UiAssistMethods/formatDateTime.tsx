

function formatDateAndTime(isoString:string) {
    const date = new Date(isoString);
  
    if (isNaN(date)) {
      return '';
    }
  
    const day = date.getDate().toString().padStart(2, '0'); 
    const monthOptions = { month: 'short' };
    const month = date.toLocaleString('en-US', monthOptions);
    const year = date.getFullYear(); 
  
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${(hours % 12) || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  
    return `${day} ${month} ${year}, at ${formattedTime}`;
  }
  
  
  export default formatDateAndTime;