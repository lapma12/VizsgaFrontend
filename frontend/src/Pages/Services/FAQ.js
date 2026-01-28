import React, { useState } from 'react';
import '../../Styles/Services.css';


const faqData = [
    {
        question: 'What is CastL?',
        answer:
            'CastL is an online platform designed for communities and content creators to connect, share, and grow together.',
    },
    {
        question: 'Is CastL free to use?',
        answer:
            'Yes, CastL offers free access to its core features. Premium features may be introduced in the future.',
    },
    {
        question: 'How can I register?',
        answer:
            'You can create an account by signing up with your email address on the Sign Up page.',
    },
    {
        question: 'How can I delete my account?',
        answer:
            'To delete your account, please contact our support team and they will assist you with the process.',
    },
    {
        question: 'Is my data safe?',
        answer:
            'Yes. We take data security and user privacy seriously and apply appropriate technical and organizational measures.',
    },
];


export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);


    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };


    return (
        <div className="faq-page">
            <div className="faq-card">
                <h1>Frequently Asked Questions</h1>
                <p className="intro">
                    Here you can find answers to the most common questions about CastL.
                </p>


                <div className="faq-list">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        >
                            <button className="faq-question" onClick={() => toggle(index)}>
                                {item.question}
                                <span className="icon">{openIndex === index ? '−' : '+'}</span>
                            </button>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    <p>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>


                <div className="faq-contact">
                    <h2>Contact</h2>
                    <p>
                        If you have additional questions, feel free to contact us at{' '}
                        <a href="mailto:support@castl.com">support@castl.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}