export const metadata = {
  title: 'Terms of Service - Uprent Plus',
  description: 'Terms of Service for Uprent Plus',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          Last updated: December 25, 2025
        </p>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Uprent Plus, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily use Uprent Plus for personal, non-commercial transitory viewing only.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. AI Services</h2>
          <p>
            Our AI-powered features are provided &quot;as is&quot; without warranties. AI-generated content should be reviewed before use. We are not liable for any decisions made based on AI-generated content.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
          <p>
            Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
          <p>
            For questions about these Terms, contact us at: support@uprentplus.com
          </p>
        </section>
      </div>
    </div>
  );
}

