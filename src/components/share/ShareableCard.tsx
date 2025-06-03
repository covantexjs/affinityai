import { Heart, Twitter, Instagram, Facebook } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Archetype } from '../../types/quiz';
import Button from '../ui/Button';

interface ShareableCardProps {
  archetype: Archetype;
}

const ShareableCard: React.FC<ShareableCardProps> = ({ archetype }) => {
  const quizUrl = `${window.location.origin}/quiz`;

  const handleShare = (platform: string) => {
    const text = `I'm a ${archetype.name}! "${archetype.tagline}" Discover your romantic archetype at ${quizUrl}`;
    const url = quizUrl;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, but we could copy to clipboard
        navigator.clipboard.writeText(text);
        alert('Text copied to clipboard! Share on Instagram');
        break;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-primary opacity-10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-gradient-primary opacity-10 translate-y-1/2 -translate-x-1/2" />
      
      {/* Header */}
      <div className="relative">
        <div className="bg-gradient-primary text-white px-8 pt-12 pb-16 text-center">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-lg font-bold opacity-90">
            <Heart className="h-5 w-5 fill-current" />
            <span>Affinity AI</span>
          </div>
          
          <h1 className="text-4xl font-extrabold mb-3">{archetype.name}</h1>
          <p className="text-xl italic opacity-90">"{archetype.tagline}"</p>
        </div>
        
        {/* Curved bottom edge */}
        <div className="h-8 bg-white relative -mt-8 rounded-t-[50%]" />
      </div>
      
      {/* Body */}
      <div className="px-8 pb-8 text-center">
        {/* Keywords */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {archetype.keywords.map((keyword, index) => (
            <span 
              key={index}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium"
            >
              {keyword.text} {keyword.emoji}
            </span>
          ))}
        </div>
        
        {/* Compatibility */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-primary-500 mb-2">
            Top Matches
          </h3>
          <p className="text-gray-700">
            {archetype.compatibleWith.join(' & ')}
          </p>
        </div>
        
        {/* QR Code Section */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <QRCodeSVG 
              value={quizUrl}
              size={96}
              level="H"
              includeMargin
              className="rounded"
            />
          </div>
          <div className="text-left">
            <p className="text-sm mb-1">
              Scan to discover <span className="font-semibold text-primary-500">your</span> romantic archetype
            </p>
            <p className="text-sm">
              Or visit: <span className="font-semibold text-primary-500">affinity.ai/quiz</span>
            </p>
          </div>
        </div>
        
        {/* Take Quiz Button */}
        <Button size="lg" onClick={() => window.location.href = quizUrl}>
          Take the Quiz
        </Button>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-4">Share your archetype</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => handleShare('twitter')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-500 transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleShare('instagram')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-500 transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleShare('facebook')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-500 transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareableCard;