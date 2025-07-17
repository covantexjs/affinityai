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

const PrivacyPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Card>
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: March 1, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
                <p className="text-gray-600 mb-4">
                  We collect information that you voluntarily provide when taking our quiz and using our services:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Quiz responses and results</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Contact information when you reach out to us</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">
                  We use the collected information to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Generate your romantic archetype results</li>
                  <li>Process your payments and deliver premium content</li>
                  <li>Improve our quiz accuracy and user experience</li>
                  <li>Respond to your inquiries and support requests</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Data Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Secure SSL encryption for all data transmission</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information by authorized personnel</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
                <p className="text-gray-600 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Access your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about our Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@affinity.ai" className="text-primary-500 hover:text-primary-600">
                    privacy@affinity.ai
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

export { PrivacyPage };
export default PrivacyPage;