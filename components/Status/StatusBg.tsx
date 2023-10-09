import React from 'react';

type Status = 'change_request' | 'pre_production' | 'open' | 'pending' | 'ongoing' | 'In Dispute' | 'cancelled' | 'upcoming' | 'rescheduled' | 'completed';

interface StatusBgProps {
    children: string;
}

const StatusBg: React.FC<any> = ({ children }) => {
    let backgroundColor, textColor;

    if (children === 'change_request' || children === 'pre_production' || children === 'open') {
        backgroundColor = '#FBEDD9';
        textColor = '#885A00';
    } else if (children === 'pending' || children === 'ongoing' || children === 'In Dispute') {
        backgroundColor = '#FFE9E9';
        textColor = '#B50000';
    } else if (children === 'cancelled' || children === 'upcoming') {
        backgroundColor = '#E8E8E8';
    } else if (children === 'rescheduled' || children === 'completed') {
        backgroundColor = '#E6FBD9';
    }

    return (
        <div className="inline rounded-2xl border border-solid px-3 py-2" style={{ backgroundColor: backgroundColor }}>
            <p className="inline capitalize" style={{ color: textColor }}>
                {children}
            </p>
        </div>
    );
};

export default StatusBg;
