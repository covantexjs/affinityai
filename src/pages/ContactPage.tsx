import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MessageSquare, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SUPPORT_EMAIL = 'support@affinityai.me';
const SALES_EMAIL = 'sales@affinityai.me';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="md:col-span-2"
          >
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                
                {submitStatus === 'success' && (
                  <p className="text-green-600 text-center">
                    Message sent successfully! We'll get back to you soon.
                  </p>
                )}
                
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-center">
                    There was an error sending your message. Please try again.
                  </p>
                )}
              </form>
            </Card>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="space-y-6">
              <Card>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary-500" />
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <a 
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="text-primary-500 hover:text-primary-600"
                    >
                      {SUPPORT_EMAIL}
                    </a>
                    <p className="text-xs text-gray-500 mt-1">For support inquiries</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-secondary-500" />
                  <div>
                    <h3 className="font-semibold mb-1">Sales Inquiries</h3>
                    <a 
                      href={`mailto:${SALES_EMAIL}`}
                      className="text-secondary-500 hover:text-secondary-600"
                    >
                      {SALES_EMAIL}
                    </a>
                    <p className="text-xs text-gray-500 mt-1">For business and partnership inquiries</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-start gap-4">
                  <MessageSquare className="w-6 h-6 text-primary-500" />
                  <div>
                    <h3 className="font-semibold mb-1">Support</h3>
                    <p className="text-gray-600">
                      Visit our help center for quick answers
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-primary-500" />
                  <div>
                    <h3 className="font-semibold mb-1">Response Time</h3>
                    <p className="text-gray-600">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export { ContactPage };
export default ContactPage;