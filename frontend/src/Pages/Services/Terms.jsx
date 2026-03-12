import React from 'react';
import '../../Styles/Services.css';


export default function Terms() {
    return (
        <div className="legal-page">
            <div className="legal-card">
                <h1>Terms of Service</h1>
                <p className="effective-date">Effective date: January 1, 2025</p>


                <p className="intro">
                    By accessing or using CastL (the "Service"), you agree to be bound by
                    these Terms of Service. If you do not agree to these terms, please do
                    not use the Service.
                </p>


                <section>
                    <h2>1. General Conditions</h2>
                    <p>
                        These Terms govern your access to and use of CastL. We reserve the
                        right to update or modify these Terms at any time.
                    </p>
                </section>


                <section>
                    <h2>2. Account Registration</h2>
                    <ul>
                        <li>You must provide accurate and complete information</li>
                        <li>You are responsible for maintaining the security of your account</li>
                    </ul>
                </section>


                <section>
                    <h2>3. Acceptable Use</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Post or distribute unlawful or harmful content</li>
                        <li>Harass, abuse, or harm other users</li>
                        <li>Attempt to compromise the security or integrity of the Service</li>
                    </ul>
                </section>


                <section>
                    <h2>4. User Content</h2>
                    <p>
                        You are solely responsible for any content you submit or publish on
                        the Service. CastL reserves the right to remove content that violates
                        these Terms or applicable laws.
                    </p>
                </section>


                <section>
                    <h2>5. Service Modifications</h2>
                    <p>
                        We reserve the right to modify, suspend, or discontinue the Service
                        at any time, with or without notice.
                    </p>
                </section>


                <section>
                    <h2>6. Disclaimer of Warranties</h2>
                    <p>
                        The Service is provided on an "as is" and "as available" basis
                        without warranties of any kind, either express or implied.
                    </p>
                </section>
            </div>
        </div>
    );
}