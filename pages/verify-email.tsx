// pages/verify-email.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      // Call the backend to verify the email
      axios
        .post('/api/verify-email', { token })
        .then((response) => {
          setMessage('Your email has been verified successfully!');
        })
        .catch((error) => {
          setMessage('Invalid or expired token.');
        });
    }
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
    </div>
  );
};

// Set the `getLayout` function to null for this page (i.e., no layout)
VerifyEmail.getLayout = function PageLayout(page) {
  return page; // Render without a layout
};

export default VerifyEmail;
