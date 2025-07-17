import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export const TermsPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Card>
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: March 1, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 mb-4">
                  By accessing and using Affinity AI's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Service Description</h2>
                <p className="text-gray-600 mb-4">
                  Affinity AI provides personality assessment services through our romantic archetype quiz. Our services include:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Free romantic archetype assessment</li>
                  <li>Premium detailed reports and insights</li>
                  <li>Compatibility matching features</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
                <p className="text-gray-600 mb-4">
                  You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Provide accurate information when using our services</li>
                  <li>Not misuse or attempt to manipulate our assessment system</li>
                  <li>Respect the intellectual property rights of our content</li>
                  <li>Not share premium content without authorization</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Premium Services</h2>
                <p className="text-gray-600 mb-4">
                  Premium services are subject to the following terms:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>One-time payment for lifetime access to your report</li>
                  <li>30-day money-back guarantee</li>
                  <li>Non-transferable access to premium features</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Disclaimer</h2>
                <p className="text-gray-600 mb-4">
                  Our assessments are for entertainment and self-reflection purposes only. They do not constitute professional advice. Results should not be used as the sole basis for making important life decisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">6. Contact</h2>
                <p className="text-gray-600">
                  For questions about these terms, please contact us at{' '}
                  <a href="mailto:legal@affinity.ai" className="text-primary-500 hover:text-primary-600">
                    legal@affinity.ai
                  </a>
                </p>
              </section>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};