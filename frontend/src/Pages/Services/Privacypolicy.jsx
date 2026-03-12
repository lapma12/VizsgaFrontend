import React from 'react';
import '../../Styles/Services.css';


export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <div className="privacy-card">
        <h1>Privacy Policy</h1>
        <p className="effective-date">Effective date: January 1, 2025</p>


        <p className="intro">
          CastL ("the Service") respects your privacy and is committed to
          protecting your personal data. This Privacy Policy explains how we
          collect, use, and safeguard your information when you use our
          platform.
        </p>


        <section>
          <h2>1. Information We Collect</h2>
          <ul>
            <li><strong>Personal Information:</strong> name, email address, account details</li>
            <li><strong>Technical Information:</strong> IP address, browser type, device information</li>
            <li><strong>Usage Data:</strong> page views, interactions, and activity on the platform</li>
          </ul>
        </section>


        <section>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To operate, maintain, and improve the Service</li>
            <li>To manage user accounts and provide support</li>
            <li>To communicate important updates and notifications</li>
            <li>To ensure security and prevent fraud or abuse</li>
          </ul>
        </section>


        <section>
          <h2>3. Data Sharing</h2>
          <p>
            We do not sell or rent your personal data. We may share information
            only in the following cases:
          </p>
          <ul>
            <li>When required by law or legal obligations</li>
            <li>With trusted partners necessary to operate the Service</li>
          </ul>
        </section>


        <section>
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal data against unauthorized access, loss, or
            misuse.
          </p>
        </section>


        <section>
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction or deletion of your data</li>
            <li>Request restriction of data processing</li>
          </ul>
        </section>


        <section>
          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or your data,
            please contact us at{' '}
            <a href="mailto:support@castl.com">support@castl.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}