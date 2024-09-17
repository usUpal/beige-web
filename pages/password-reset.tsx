import React from 'react';

const PasswordReset = () => {
  return <div>PasswordReset</div>;
};
// Set the `getLayout` function to null for this page (i.e., no layout)
PasswordReset.getLayout = function PageLayout(page: any) {
  return page; // Render without a layout
};
export default PasswordReset;
