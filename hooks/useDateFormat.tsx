import { useState, useEffect } from 'react';

const useDateFormat = (inputDate) => {
    const [formattedDateTime, setFormattedDateTime] = useState<any | null>(null);

    useEffect(() => {
        const makeDateFormat = (inputDate) => {
            const date = new Date(inputDate);

            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            const month = months[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();

            let hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // Handle midnight (0 hours)
            const formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;

            const formattedDate = `${month} ${day}, ${year}`;

            return {
                date: formattedDate,
                time: formattedTime
            };
        };

        const formattedDateTime = makeDateFormat(inputDate);
        setFormattedDateTime(formattedDateTime);
    }, [inputDate]);

    return formattedDateTime;
};

export default useDateFormat;
