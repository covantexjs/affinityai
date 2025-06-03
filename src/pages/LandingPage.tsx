import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Users, MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import GradientText from '../components/ui/GradientText';
import Card from '../components/ui/Card';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const LandingPage = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:pt-40 md:pb-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white -z-10" />
        
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover how you <GradientText>love, connect,</GradientText> and <GradientText>relate</GradientText>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto">
              Uncover your romantic archetype and learn how it shapes your relationships with our science-backed assessment
            </p>
            
            <Link to="/quiz">
              <Button size="lg" className="mb-8">
                Take the Quiz <span className="ml-2">→</span>
              </Button>
            </Link>
            
            <p className="text-sm text-gray-500">Free • Takes just 5 minutes • No sign-up required</p>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 lg:gap-12"
          >
            <motion.div variants={fadeInUp}>
              <div className="flex mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Self-Understanding</h3>
              <p className="text-gray-600">
                Gain deep insights into how you approach love and what drives your romantic choices
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <div className="flex mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Better Matches</h3>
              <p className="text-gray-600">
                Find potential partners who truly complement your unique relationship style
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <div className="flex mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Relationship Growth</h3>
              <p className="text-gray-600">
                Identify patterns, strengths, and areas for growth in your romantic relationships
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <div className="flex mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Communication Clarity</h3>
              <p className="text-gray-600">
                Learn how to better express your needs and understand your partner's perspective
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to discover your romantic archetype and transform your relationships
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="relative">
              <Card className="h-full flex flex-col items-center text-center pt-8">
                <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Take the Quiz</h3>
                <p className="text-gray-600">
                  Answer 15 questions about how you approach relationships and love
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="relative">
              <Card className="h-full flex flex-col items-center text-center pt-8">
                <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Your Results</h3>
                <p className="text-gray-600">
                  Discover your unique archetype and learn what drives your romantic choices
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="relative">
              <Card className="h-full flex flex-col items-center text-center pt-8">
                <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Unlock Insights</h3>
                <p className="text-gray-600">
                  Learn about your compatibility with other archetypes and get personalized advice
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Archetype Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Archetype</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Which of these 12 romantic archetypes resonates with your relationship style?
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-3 bg-gradient-primary rounded-t-xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Narrative Idealist</h3>
                <p className="text-gray-500 text-sm mb-4 italic">
                  "Love is a story I want to co-write."
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Deep-feeling ✨</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Poetic 📝</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Nostalgic 🌙</span>
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-3 bg-gradient-primary rounded-t-xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Steady Guardian</h3>
                <p className="text-gray-500 text-sm mb-4 italic">
                  "I create safety in a chaotic world."
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Reliable 🛡️</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Protective 🏠</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Consistent 📊</span>
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-3 bg-gradient-primary rounded-t-xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Vibrant Explorer</h3>
                <p className="text-gray-500 text-sm mb-4 italic">
                  "Love should be an adventure we share."
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Spontaneous 🌟</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Playful 🎮</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Independent 🚀</span>
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="md:col-span-3 mt-6 text-center">
              <Link to="/quiz">
                <Button size="lg">
                  Find Your Archetype
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <Card>
                <h3 className="text-xl font-semibold mb-3">How accurate is the romantic archetype quiz?</h3>
                <p className="text-gray-600">
                  Our quiz is based on psychological principles and relationship science. While no quiz can capture the full complexity of human relationships, our assessment provides valuable insights into your patterns and preferences.
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card>
                <h3 className="text-xl font-semibold mb-3">How long does the quiz take to complete?</h3>
                <p className="text-gray-600">
                  The quiz takes approximately 5 minutes to complete. It consists of 15 questions designed to identify your unique romantic archetype.
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card>
                <h3 className="text-xl font-semibold mb-3">What's included in the premium report?</h3>
                <p className="text-gray-600">
                  The premium report includes a comprehensive 10-15 page analysis of your romantic archetype, detailed compatibility insights, personalized growth opportunities, and AI-generated conversation starters for better communication.
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card>
                <h3 className="text-xl font-semibold mb-3">Can I retake the quiz?</h3>
                <p className="text-gray-600">
                  Yes! You can retake the quiz as many times as you'd like. People grow and change, so your results may evolve over time as your relationship preferences and patterns shift.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-primary -z-10 opacity-10" />
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your relationships?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Take the first step toward deeper connection and understanding by discovering your romantic archetype today.
            </p>
            <Link to="/quiz">
              <Button size="lg">
                Take the Quiz Now <span className="ml-2">→</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;