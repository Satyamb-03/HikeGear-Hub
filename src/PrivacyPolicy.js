import React from 'react';
import './About.css';

function PrivacyPolicy() {
  const baseHiringFee = 50;
  const increment = 10;
  const threshold = 30;
  const refundableFee = baseHiringFee + increment * threshold;

  return (
    <div className="privacy-policy-container">
      <h2>Privacy Policy</h2>
      
      <p>
        At HikeGear Hub, your privacy is of utmost importance to us. We are committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, and safeguard your data.
      </p>
      
      <h3>1. Collection of Information</h3>
      <p>
        We collect information such as your name, contact details when you rent gear from us. This information is used solely for processing your orders and ensuring a smooth experience.
      </p>
      
      <h3>2. Use of Information</h3>
      <p>
        Your information is used to:
      </p>
      <ul>
        <li>Process orders and manage rentals.</li>
        <li>Improve our services based on feedback.</li>
      </ul>
      
      <h3>3. Data Security</h3>
      <p>
        We take the security of your personal information seriously. All data is stored securely, and we implement best practices to ensure your data is protected from unauthorized access.
      </p>

      <h3>4. Refundable Fees</h3>
      <p>
        When renting gear from HikeGear Hub, a minimum refundable fee of ${baseHiringFee} is required. This refundable fee can increase with the price. On every $10 above, an additional ${increment} will be added, up to a total of ${refundableFee}.
      </p>
      
      <h3>5. Refund Policy</h3>
      <p>
        Upon the safe and timely return of rented gear in good condition, the refundable fee will be returned to the customer. Any damage or delays may result in deductions from the refundable fee.
      </p>

      <h3>6. Changes to This Policy</h3>
      <p>
        HikeGear Hub reserves the right to modify this Privacy Policy at any time. We encourage you to review this page periodically to stay informed about any updates.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
