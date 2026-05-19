import { shop } from './shop';

export type PolicyContent = {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: Array<{ heading: string; points: string[] }>;
};

export function getPolicies(): Record<string, PolicyContent> {
  const { name, supportEmail, catalog } = shop;

  return {
    'terms-and-conditions': {
      title: 'Terms & Conditions',
      intro: `These Terms & Conditions govern your access to and use of the ${name} website, mobile experience, and services, including digital payments processed through authorized payment partners.`,
      lastUpdated: 'April 22, 2026',
      sections: [
        {
          heading: 'Eligibility and account',
          points: [
            'You must provide accurate registration details and keep your account credentials secure.',
            'You are responsible for activities performed through your account unless unauthorized use is reported promptly.',
            'We may suspend accounts involved in fraudulent, abusive, or unlawful activity.',
          ],
        },
        {
          heading: 'Orders, pricing, and availability',
          points: [
            `All ${catalog.plural} listings are subject to availability, serviceability, and acceptance by us.`,
            'Prices, offers, and stock may change without prior notice; obvious pricing errors may lead to cancellation and refund.',
            'Order confirmation does not guarantee dispatch until payment verification and internal checks are completed.',
          ],
        },
        {
          heading: 'Payments and payment partners',
          points: [
            'Online payments are facilitated by authorized payment gateway partners and supported banking partners using secure encrypted channels.',
            'Card, UPI, net banking, and wallet transactions are authorized by your payment provider; we do not store full card details on our servers.',
            'In case of payment failure, timeout, or duplicate debit, reconciliation is handled as per payment partner and banking timelines.',
          ],
        },
        {
          heading: 'Shipping, cancellations, and refunds',
          points: [
            'Delivery timelines are indicative and may vary based on location, logistics constraints, and force majeure events.',
            'Cancellation, return, and refund eligibility are governed by our Refund & Cancellation policy.',
            'Approved refunds are processed to the original payment source within applicable banking timelines.',
          ],
        },
        {
          heading: 'Acceptable use and intellectual property',
          points: [
            'You must not misuse the platform, attempt unauthorized access, or interfere with service operations.',
            `All trademarks, logos, design assets, and content are owned by or licensed to ${name} and may not be used without permission.`,
            'User-generated feedback/reviews must be lawful and non-defamatory; we may moderate or remove violating content.',
          ],
        },
        {
          heading: 'Limitation of liability and governing law',
          points: [
            `To the extent permitted by law, ${name} is not liable for indirect, incidental, or consequential damages.`,
            'Our aggregate liability for any claim is limited to the amount paid for the relevant order.',
            'These terms are governed by laws of India, and disputes are subject to the jurisdiction of competent courts in India.',
          ],
        },
        {
          heading: 'Contact',
          points: [`For any questions regarding these terms, contact ${supportEmail}.`],
        },
      ],
    },
    'terms-of-use': {
      title: 'Terms & Conditions',
      intro: 'Alias of Terms & Conditions for compatibility with existing links.',
      lastUpdated: 'April 22, 2026',
      sections: [
        {
          heading: 'Read the latest terms',
          points: ['Please refer to the current Terms & Conditions page for complete details.'],
        },
      ],
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      intro: `This Privacy Policy explains what personal data we collect, why we collect it, how we use it, and your choices when using ${name} services.`,
      lastUpdated: 'April 22, 2026',
      sections: [
        {
          heading: 'Information we collect',
          points: [
            'Identity and contact details such as name, email, mobile number, and shipping address.',
            `Order and transaction details including ${catalog.plural} purchased, amount paid, and payment status.`,
            'Technical and usage data such as IP address, browser type, device metadata, and interaction events.',
          ],
        },
        {
          heading: 'How we use your information',
          points: [
            `To create and manage your account, process orders, provide customer support, and deliver ${catalog.plural}.`,
            'To send essential service communications such as order confirmations, shipment updates, and refund status.',
            `To improve ${catalog.singular} recommendations, site performance, fraud prevention, and overall user experience.`,
          ],
        },
        {
          heading: 'Payments and payment processing',
          points: [
            'Payment data required to complete transactions is processed through authorized payment gateway partners and regulated payment networks.',
            'Sensitive card credentials are handled by payment processors using secure tokenized/encrypted infrastructure.',
            'We receive limited payment metadata (for example payment ID, status, and method) for reconciliation and support.',
          ],
        },
        {
          heading: 'Sharing of information',
          points: [
            'We share necessary data with logistics partners, payment processors, and service providers strictly for service delivery.',
            'We may disclose information when required by law, court order, or valid legal process.',
            'We do not sell your personal information to third parties for independent marketing.',
          ],
        },
        {
          heading: 'Cookies and tracking',
          points: [
            'Cookies and similar technologies are used for session management, analytics, and improved user experience.',
            'You may control cookies through browser settings; disabling certain cookies may affect site functionality.',
          ],
        },
        {
          heading: 'Data retention and security',
          points: [
            'We retain data for as long as needed for legal, tax, fraud-prevention, and business continuity requirements.',
            'Reasonable administrative, technical, and organizational safeguards are implemented to protect your information.',
          ],
        },
        {
          heading: 'Your rights',
          points: [
            'You may request access, correction, or deletion of eligible personal data by contacting support.',
            'You may opt out of promotional communication while continuing to receive transactional updates.',
          ],
        },
        {
          heading: 'Contact',
          points: [`For privacy queries or requests, write to ${supportEmail}.`],
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      intro: 'Alias of Privacy Policy for compatibility with existing links.',
      lastUpdated: 'April 22, 2026',
      sections: [
        {
          heading: 'Read the latest privacy policy',
          points: ['Please refer to the current Privacy Policy page for complete details.'],
        },
      ],
    },
    shipping: {
      title: 'Shipping',
      intro: 'Shipping information and delivery timelines for orders.',
      lastUpdated: 'April 22, 2026',
      sections: [
        {
          heading: 'Shipping',
          points: [
            'Delivery timelines vary based on your location and order size.',
            'Once shipped, tracking information may be provided in your account.',
            'Delays can happen due to weather, holidays, or courier constraints.',
          ],
        },
      ],
    },
    'refund-cancellation': {
      title: 'Refund & Cancellation',
      intro: 'Guidelines for cancellations, returns, and refunds.',
      lastUpdated: 'April 22, 2026',
      sections: [
        {
          heading: 'Refund & Cancellation',
          points: [
            'Orders can be cancelled before shipping (subject to status).',
            'Refunds are processed after inspection/verification where applicable.',
            `For help, contact ${supportEmail} with your order ID.`,
          ],
        },
      ],
    },
  };
}
