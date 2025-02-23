import React from 'react';

type Status = 'change_request' | 'pre_production' | 'open' | 'pending' | 'ongoing' | 'In Dispute' | 'cancelled' | 'upcoming' | 'rescheduled' | 'completed' | 'paid';

interface StatusBgProps {
  children: string;
}

const StatusBg: React.FC<any> = ({ children }) => {
  let backgroundColor, textColor;

  if (children === 'change_request' || children === 'pre_production' || children === 'open') {
    backgroundColor = '#FBEDD9';
    textColor = '#885A00';
  } else if (children === 'pending' || children === 'ongoing' || children === 'in_dispute' || children === 'Unverified') {
    backgroundColor = '#FFE9E9';
    textColor = '#B50000';
  } else if (children === 'cancelled' || children === 'upcoming') {
    backgroundColor = '#E8E8E8';
  } else if (children === 'rescheduled' || children === 'completed') {
    backgroundColor = '#E6FBD9';
  } else if (children === 'active' || children === 'Active') {
    backgroundColor = '#DDF5F0';
  } else if (children === 'inactive' || children === 'InActive') {
    backgroundColor = '#E7CF02';
  } else if (children === 'paid' || children === 'Paid' || children === 'accepted') {
    backgroundColor = '#5cb85c';
    textColor = '#fff';
  }

  return (
    <div className="inline rounded-lg border border-solid px-3 py-1 text-black dark:text-white" style={{ backgroundColor: backgroundColor }}>
      <p className="text-md inline capitalize text-black dark:text-white" style={{ color: textColor }}>
        {children}
      </p>
    </div>
  );
};

export default StatusBg;
