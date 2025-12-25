export const metadata = {
  title: 'Privacy Policy - Uprent Plus',
  description: 'Privacy Policy for Uprent Plus',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          Last updated: December 25, 2025
        </p>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Name and email address</li>
            <li>Property search preferences</li>
            <li>Application information</li>
            <li>Payment information (processed by Stripe)</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Provide and improve our services</li>
            <li>Generate AI-powered application letters</li>
            <li>Send you notifications about properties</li>
            <li>Process payments and subscriptions</li>
            <li>Respond to your requests and support needs</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Storage</h2>
          <p>
            Your data is stored securely using Supabase with encryption at rest and in transit. We implement appropriate security measures to protect your personal information.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Supabase (database and authentication)</li>
            <li>OpenAI (AI text generation)</li>
            <li>Stripe (payment processing)</li>
            <li>Vercel (hosting)</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p>
            For privacy-related questions, contact us at: privacy@uprentplus.com
          </p>
        </section>
      </div>
    </div>
  );
}

