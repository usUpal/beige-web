import React from 'react';

const StatusBg = ({children}) => {

    let backgroundColor, textColor;

    if (
        children === 'change_request' ||
        children === 'pre_production' ||
        children === 'open'
    ) {
        backgroundColor = '#FBEDD9';
        textColor = '#885A00';
    } else if (
        children === 'pending' ||
        children === 'ongoing' ||
        children === 'In Dispute'
    ) {
        backgroundColor = '#FFE9E9';
        textColor = '#B50000';
        borderColor = '#B50000';
    } else if (children === 'cancelled' || children === 'upcoming') {
        backgroundColor = '#E8E8E8';
    } else if (children === 'rescheduled' || children === 'completed') {
        backgroundColor = '#E6FBD9';
    }

    return (
        <div className="inline rounded-2xl px-3 py-2 border border-solid"  style={{backgroundColor:backgroundColor}}>
            <p className='inline capitalize' style={{color:textColor}}>{children}</p>
        </div>
    );

};

export default StatusBg;
