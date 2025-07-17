import { Handler } from '@netlify/functions';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

// HTML template for the PDF
const createPDFHTML = (archetype: any, customerName?: string, sessionId?: string) => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  // Archetype-specific writing styles based on the PDF document
  const archetypeStyles = {
    'Narrative Idealist': {
      tone: 'poetic and metaphorical',
      phrases: [
        'Your love story unfolds like chapters in a novel',
        'You see the poetry in everyday moments',
        'For you, relationships are rich narratives filled with meaning',
        'You craft love stories rather than simply experiencing them',
        'Your romantic vision creates beauty in relationships'
      ],
      advice: 'Remember that even the most beautiful love stories have ordinary chapters. These moments of simplicity can be just as meaningful as the grand romantic gestures you naturally create.'
    },
    'Steady Guardian': {
      tone: 'grounded and reassuring',
      phrases: [
        'Your consistent presence creates safety in relationships',
        'You build foundations that stand the test of time',
        'Your practical approach to love offers real security',
        'You show love through reliable actions and steadfast support',
        'Your commitment creates the bedrock of lasting relationships'
      ],
      advice: 'While your stability is your greatest strength, remember that occasional spontaneity can add joy and freshness to your relationships. Small surprises can reinforce the security you naturally provide.'
    },
    'Vibrant Explorer': {
      tone: 'energetic and enthusiastic',
      phrases: [
        'Your relationships thrive on adventure and new experiences',
        'You bring spontaneity and excitement to love',
        'Your playful spirit keeps relationships fresh and engaging',
        'You see romance as an exciting journey to share',
        'Your enthusiasm is contagious and energizing'
      ],
      advice: 'While your adventurous spirit keeps relationships exciting, remember that building consistent rituals can create a sense of home and belonging that complements your natural spontaneity.'
    },
    'Mindful Architect': {
      tone: 'thoughtful and strategic',
      phrases: [
        'You approach relationships with intention and careful consideration',
        'Your analytical mind helps you build relationships with purpose',
        'You value clarity and structure in your connections',
        'You create relationships designed for long-term success',
        'Your thoughtful planning creates space for growth together'
      ],
      advice: 'While your thoughtful approach creates solid relationships, remember that some of the most meaningful moments come from embracing the unplanned. Allow space for organic development alongside your intentional design.'
    },
    'Compassionate Nurturer': {
      tone: 'warm and empathetic',
      phrases: [
        'Your natural empathy creates deep emotional connections',
        'You intuitively understand others\' emotional needs',
        'Your nurturing presence helps others feel truly seen',
        'You create emotional safety through your compassionate approach',
        'Your supportive nature helps relationships flourish'
      ],
      advice: 'While your care for others is beautiful, remember that receiving support is equally important. Allow your partners to nurture you in return, creating a balanced exchange of care.'
    },
    'Candid Connector': {
      tone: 'direct and refreshing',
      phrases: [
        'Your straightforward communication creates clarity',
        'You cut through confusion with refreshing honesty',
        'Your authentic approach builds trust quickly',
        'You value real connection over social niceties',
        'Your directness helps resolve issues before they grow'
      ],
      advice: 'While your honesty is refreshing, remember that softening your delivery can help others receive your message more openly. Directness paired with kindness creates the strongest impact.'
    },
    'Curious Observer': {
      tone: 'inquisitive and perceptive',
      phrases: [
        'Your thoughtful questions create space for authentic sharing',
        'You notice details others miss in relationships',
        'Your perceptive nature helps you truly understand others',
        'You approach relationships with genuine curiosity',
        'Your observant nature helps you respond to unspoken needs'
      ],
      advice: 'While your observant nature helps you understand others deeply, remember to share your own thoughts and feelings too. Mutual disclosure creates the balanced intimacy you seek.'
    },
    'Devoted Empath': {
      tone: 'sensitive and emotionally attuned',
      phrases: [
        'Your emotional intelligence creates profound connections',
        'You sense the feelings of others with remarkable accuracy',
        'Your compassionate heart creates space for vulnerability',
        'You naturally attune to the emotional currents in relationships',
        'Your empathetic presence makes others feel truly understood'
      ],
      advice: 'While your emotional attunement is a gift, remember to maintain healthy boundaries to prevent emotional exhaustion. Self-care enables you to continue offering the empathy that makes your connections so special.'
    },
    'Disruptive Visionary': {
      tone: 'bold and innovative',
      phrases: [
        'You bring fresh perspectives to relationships',
        'Your unconventional approach creates unique connections',
        'You challenge outdated relationship patterns',
        'Your innovative thinking creates exciting possibilities',
        'Your willingness to break norms leads to authentic connections'
      ],
      advice: 'While your innovative approach keeps relationships fresh, remember that some traditions provide valuable structure. Balance your disruptive energy with respect for meaningful conventions.'
    },
    'Grounded Harmonizer': {
      tone: 'balanced and peaceful',
      phrases: [
        'You create harmony in relationships through your balanced approach',
        'Your calm presence helps navigate emotional storms',
        'You naturally find middle ground in conflicts',
        'Your steady temperament provides emotional stability',
        'You bring perspective that helps maintain relationship balance'
      ],
      advice: 'While your harmonizing nature creates peaceful relationships, remember that productive conflict can lead to growth. Sometimes rocking the boat is necessary for deeper connection.'
    },
    'Magnetic Flame': {
      tone: 'passionate and intense',
      phrases: [
        'Your passionate nature creates electric connections',
        'You bring intensity and depth to relationships',
        'Your emotional honesty creates powerful intimacy',
        'You experience love with remarkable depth and vibrancy',
        'Your authentic expression inspires others to open up'
      ],
      advice: 'While your intensity creates powerful connections, remember that sustainable relationships also need moments of lightness and play. Balance your natural depth with opportunities for simple joy.'
    },
    'Pragmatic Partner': {
      tone: 'practical and solution-oriented',
      phrases: [
        'Your practical approach solves relationship challenges efficiently',
        'You bring valuable realism to romantic connections',
        'Your solution-focused mindset helps navigate difficulties',
        'You show love through tangible support and assistance',
        'Your common sense approach creates sustainable relationships'
      ],
      advice: 'While your practical nature creates stable relationships, remember that emotional expression is equally important. Make space for sharing feelings alongside finding solutions.'
    },
    'Resilient Realist': {
      tone: 'adaptable and persevering',
      phrases: [
        'Your resilience helps relationships weather any storm',
        'You approach challenges with remarkable adaptability',
        'Your realistic expectations create sustainable connections',
        'You balance optimism with practical awareness',
        'Your perseverance helps relationships grow through difficulties'
      ],
      advice: 'While your resilience helps you endure challenges, remember that it\'s okay to be vulnerable about struggles. Sharing your process builds intimacy alongside your natural strength.'
    },
    'Sacred Romantic': {
      tone: 'reverent and spiritual',
      phrases: [
        'You see love as a sacred connection that transcends the ordinary',
        'Your spiritual approach brings depth to relationships',
        'You honor the divine aspects of human connection',
        'Your reverence for love creates meaningful bonds',
        'You approach relationships with mindfulness and presence'
      ],
      advice: 'While your spiritual approach brings depth to relationships, remember that embracing human imperfection is part of the sacred journey. Find divinity in the flawed and beautiful reality of love.'
    }
  };
  
  // Get the style for this archetype or use a default
  const style = archetypeStyles[archetype.name] || {
    tone: 'authentic and insightful',
    phrases: [
      'Your unique approach to relationships creates meaningful connections',
      'You bring special qualities to your partnerships',
      'Your natural tendencies help you form authentic bonds',
      'Your relationship style offers valuable strengths',
      'Your approach to love has distinctive qualities'
    ],
    advice: 'Remember to balance your natural strengths with awareness of potential blind spots. This creates the most fulfilling relationships.'
  };
  
  // Randomly select phrases to use throughout the document
  const getRandomPhrase = () => style.phrases[Math.floor(Math.random() * style.phrases.length)];

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${archetype.name} Love Blueprint</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box !important;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background: white;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 8mm; /* Reduced from 12mm */
            margin: 0 auto;
            background: white;
            page-break-after: auto; /* Changed from always !important */
            position: relative;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        /* Cover Page Styles */
        .cover-page {
            padding: 20px;
            text-align: center !important;
            min-height: 85% !important;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #f8f9ff 0%, #e6f3ff 100%);
            border-radius: 12px;
            padding: 40px;
            page-break-after: always !important;
        }
        
        .cover-title {
            display: none;
            font-weight: 700;
            color: #6c5ce7;
            margin-bottom: 16px;
            letter-spacing: -0.02em;
        }
        
        .cover-subtitle {
            display: none;
            color: #6c5ce7;
            margin-bottom: 40px;
            font-weight: 400;
        }
        
        .cover-archetype {
            font-size: 32px;
            font-weight: 600;
            color: #fd79a8;
            margin-bottom: 16px;
        }
        
        .cover-tagline {
            font-size: 18px;
            font-style: italic;
            color: #6c5ce7;
            margin-bottom: 40px;
            opacity: 0.9;
        }
        
        .cover-customer {
            font-size: 18px;
            color: #4a5568;
            margin-top: 40px;
        }
        
        .cover-date {
            font-size: 14px;
            color: #718096;
            margin-top: 20px;
        }
        
        /* Content Page Styles */
        .content-page {
            padding: 10px 0;
            page-break-before: auto !important;
        }
        
        .page-header {
            border-bottom: 3px solid #6c5ce7;
            padding-bottom: 15px; /* Reduced from 20px */
            margin-bottom: 20px; /* Reduced from 40px */
            page-break-after: avoid;
        }
        
        .page-title {
            font-size: 28px; /* Reduced from 32px */
            font-weight: 700;
            color: #6c5ce7;
            margin-bottom: 5px; /* Reduced from 8px */
        }
        
        .page-subtitle {
            font-size: 16px;
            color: #718096;
        }
        
        .section {
            margin-bottom: 20px; /* Reduced from 32px */
            page-break-inside: auto; /* Changed from avoid !important */
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 10px; /* Reduced from 16px */
            padding-left: 16px;
            border-left: 4px solid #6c5ce7;
        }
        
        .section-content {
            font-size: 14px;
            line-height: 1.6; /* Reduced from 1.7 */
            color: #4a5568;
            margin-bottom: 10px; /* Reduced from 16px */
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #f8f9ff 0%, #e6f3ff 100%);
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px; /* Reduced from 20px */
            margin: 15px 0; /* Reduced from 20px */
            border-left: 4px solid #6c5ce7;
            page-break-inside: avoid;
        }
        
        .highlight-title {
            font-weight: 600;
            color: #6c5ce7;
            margin-bottom: 5px; /* Reduced from 8px */
        }
        
        .keywords-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px; /* Reduced from 12px */
            margin: 15px 0; /* Reduced from 20px */
            page-break-inside: auto;
        }
        
        .keyword-item {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px; /* Reduced from 12px 16px */
            text-align: center;
            font-weight: 500;
            color: #4a5568;
            page-break-inside: avoid;
        }
        
        .compatibility-section {
            background: #f0fff4;
            border: 1px solid #c6f6d5;
            border-radius: 8px;
            padding: 15px; /* Reduced from 20px */
            margin: 15px 0; /* Reduced from 20px */
            page-break-inside: auto;
        }
        
        .compatibility-title {
            color: #2f855a;
            font-weight: 600;
            margin-bottom: 10px; /* Reduced from 12px */
            page-break-inside: avoid !important;
        }
        
        .compatibility-list {
            list-style: none;
            padding: 0;
        }
        
        .compatibility-item {
            background: white;
            border: 1px solid #c6f6d5;
            border-radius: 4px;
            padding: 6px 10px; /* Reduced from 8px 12px */
            margin: 3px 0; /* Reduced from 4px */
            color: #2f855a;
            font-weight: 500;
            page-break-inside: avoid;
        }
        
        .bullet-list {
            list-style: none;
            padding: 0;
            margin: 12px 0; /* Reduced from 16px */
            page-break-inside: auto;
        }
        
        .bullet-item {
            position: relative;
            padding-left: 20px; /* Reduced from 24px */
            margin-bottom: 6px; /* Reduced from 8px */
            color: #4a5568;
            page-break-inside: avoid;
        }
        
        .bullet-item::before {
            content: "•";
            color: #6c5ce7;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .conversation-starters {
            background: #fffaf0;
            border: 1px solid #fed7aa;
            border-radius: 8px;
            padding: 15px; /* Reduced from 20px */
            margin: 15px 0; /* Reduced from 20px */
            page-break-inside: auto;
        }
        
        .conversation-title {
            color: #c05621;
            font-weight: 600;
            margin-bottom: 10px; /* Reduced from 12px */
            page-break-inside: avoid !important;
        }
        
        .conversation-item {
            background: white;
            border: 1px solid #fed7aa;
            border-radius: 4px;
            padding: 10px; /* Reduced from 12px */
            margin: 6px 0; /* Reduced from 8px */
            font-style: italic;
            color: #744210;
            page-break-inside: avoid;
        }
        
        .footer {
            position: absolute;
            bottom: 15mm; /* Reduced from 20mm */
            left: 15mm; /* Reduced from 20mm */
            right: 15mm; /* Reduced from 20mm */
            text-align: center;
            font-size: 11px; /* Reduced from 12px */
            color: #a0aec0;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px; /* Reduced from 16px */
        }
        
        .page-number {
            position: absolute;
            bottom: 8mm; /* Reduced from 10mm */
            right: 15mm; /* Reduced from 20mm */
            font-size: 11px; /* Reduced from 12px */
            color: #a0aec0;
        }
        
        /* Couples CTA styling */
        .couples-cta {
            background: linear-gradient(135deg, #f0e6ff 0%, #e6e6ff 100%);
            border: 1px solid #d6bcfa;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #805ad5;
            page-break-inside: avoid;
        }
        
        .couples-cta-title {
            font-weight: 600;
            color: #553c9a;
            margin-bottom: 8px;
            font-size: 16px;
        }
        
        .couples-cta-text {
            color: #553c9a;
            line-height: 1.4;
            font-size: 13px;
        }
        
        /* Critical sections that should never break */
        .cover-page,
        .highlight-box .highlight-title,
        .compatibility-section .compatibility-title,
        .conversation-starters .conversation-title {
            page-break-inside: avoid !important;
        }
        
        /* Print Styles */
        @media print {
            html, body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            .page {
                margin: 0;
                box-shadow: none;
                page-break-after: auto;
                page-break-before: auto !important;
            }
            
            /* Only force page breaks where absolutely necessary */
            .page:nth-child(1) {
                page-break-after: always !important; /* Cover page should break */
            }
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="page">
        <div class="cover-page">
            <h1 class="cover-title">Love Blueprint</h1>
            <h2 class="cover-archetype">${archetype.name}: The Love Blueprint</h2>
            <p class="cover-tagline">"Co-authoring your love story with clarity and heart."</p>
            ${customerName ? `<p class="cover-customer">Prepared for ${customerName}</p>` : ''}
            <p class="cover-date">${currentDate}</p>
        </div>
    </div>

    <!-- Page 1: Archetype Overview -->
    <div class="page">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Your Archetype: ${archetype.name}</h1>
                <p class="page-subtitle">Understanding Your Romantic Nature</p>
            </header>

            <div class="section">
                <h2 class="section-title">About Your Archetype</h2>
                <p class="section-content">${archetype.description}</p>
                <p class="section-content">${getRandomPhrase()}. This creates a unique dynamic in your relationships that others find both refreshing and meaningful.</p>
                <div class="highlight-box">
                    <div class="highlight-title">Core Insight</div>
                    <p>You don't just experience love—you create meaningful connections that become the foundation of your personal story and identity.</p>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Your Core Characteristics</h2>
                <div class="keywords-grid">
                    ${archetype.keywords.map(keyword => `
                        <div class="keyword-item">
                            ${keyword.text} ${keyword.emoji}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Compatibility Overview</h2>
                <div class="compatibility-section">
                    <div class="compatibility-title">You tend to connect well with:</div>
                    <ul class="compatibility-list">
                        ${archetype.compatibleWith.map(match => `<li class="compatibility-item">${match}</li>`).join('')}
                    </ul>
                    <p style="margin-top: 10px; color: #2f855a; font-size: 13px;">These archetypes complement your ${archetype.name} nature by providing balance to your approach while appreciating your unique perspective on love and relationships.</p>
                </div>
            </div>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 1</div>
    </div>

    <!-- Page 2: Communication Style -->
    <div class="page">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Your Communication Style</h1>
                <p class="page-subtitle">How You Express and Receive Love</p>
            </header>

            <div class="section">
                <h2 class="section-title">Communication Strengths</h2>
                <p class="section-content">As a ${archetype.name}, your communication is rich with emotion and meaning. You excel at creating emotional safety and expressing complex feelings.</p>
                <p class="section-content">With your ${style.tone} communication style, you bring unique qualities to your conversations that create deeper understanding.</p>
                <ul class="bullet-list">
                    <li class="bullet-item">Expressing emotions with poetic clarity and authenticity</li>
                    <li class="bullet-item">Active listening with genuine empathy and understanding</li>
                    <li class="bullet-item">Creating safe spaces for vulnerable conversations</li>
                    <li class="bullet-item">Reading between the lines and understanding emotional subtext</li>
                    <li class="bullet-item">Sharing personal stories that deepen intimacy</li>
                </ul>
            </div>

            <div class="section">
                <h2 class="section-title">Areas for Growth</h2>
                <ul class="bullet-list">
                    <li class="bullet-item">Being direct about practical needs and everyday concerns</li>
                    <li class="bullet-item">Discussing mundane topics without losing interest or engagement</li>
                    <li class="bullet-item">Addressing conflicts before they become emotionally overwhelming</li>
                    <li class="bullet-item">Balancing emotional expression with logical problem-solving</li>
                </ul>
            </div>

            <div class="section">
                <h2 class="section-title">Conversation Starters</h2>
                <div class="conversation-starters">
                    <div class="conversation-title">Questions designed for your ${archetype.name} nature:</div>
                    <div class="conversation-item">"What's a moment from your childhood that still influences how you love?"</div>
                    <div class="conversation-item">"If our relationship were a book, what would this chapter be about?"</div>
                    <div class="conversation-item">"What's something beautiful you noticed about us this week?"</div>
                    <div class="conversation-item">"How do you imagine we'll look back on this time in our lives?"</div>
                    <div class="conversation-item">"What's a dream you have for us that you haven't shared yet?"</div>
                </div>
                <p class="section-content">These questions align with your ${style.tone} nature and will help you create the kind of meaningful conversations you naturally value.</p>
            </div>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 2</div>
    </div>

    <!-- Page 3: Relationship Dynamics -->
    <div class="page">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Your Relationship Dynamics</h1>
                <p class="page-subtitle">Creating Lasting, Meaningful Connections</p>
            </header>

            <div class="section">
                <h2 class="section-title">Emotional Intimacy (Your Superpower)</h2>
                <p class="section-content">You excel at creating deep emotional bonds. Your ideal relationship includes regular heart-to-heart conversations, shared vulnerability, and emotional attunement with your partner.</p>
                <p class="section-content">${getRandomPhrase()}. This creates a foundation for the kind of meaningful connection you seek.</p>
                <ul class="bullet-list">
                    <li class="bullet-item">Daily check-ins about feelings and meaningful experiences</li>
                    <li class="bullet-item">Shared rituals that create meaning (morning coffee talks, evening walks)</li>
                    <li class="bullet-item">Celebrating emotional milestones and relationship anniversaries</li>
                    <li class="bullet-item">Creating space for both partners to express vulnerability safely</li>
                </ul>
            </div>

            <div class="section">
                <h2 class="section-title">Conflict Resolution Style</h2>
                <p class="section-content">You prefer to address conflicts through emotional processing rather than purely logical problem-solving. While this creates deep understanding, it's important to balance emotion with practical solutions.</p>
                
                <div class="highlight-box">
                    <div class="highlight-title">Effective Approach</div>
                    <p>Start with emotional validation and understanding, then move toward practical solutions together. This honors your ${style.tone} nature while ensuring issues get resolved effectively.</p>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Love Languages That Resonate</h2>
                <ul class="bullet-list">
                    <li class="bullet-item"><strong>Words of Affirmation:</strong> Poetic expressions of love and deep appreciation</li>
                    <li class="bullet-item"><strong>Quality Time:</strong> Meaningful conversations and shared emotional experiences</li>
                    <li class="bullet-item"><strong>Physical Touch:</strong> Affectionate gestures that convey emotional connection</li>
                    <li class="bullet-item"><strong>Acts of Service:</strong> Thoughtful gestures that show understanding of your inner world</li>
                   <li class="bullet-item"><strong>Receiving Gifts:</strong> Meaningful tokens that symbolize your unique connection</li>
                </ul>
            </div>
            
            <!-- Couples Mode CTA -->
            <div class="couples-cta">
                <h3 class="couples-cta-title">Want to compare this with your partner's archetype?</h3>
                <p class="couples-cta-text">
                    Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit <strong>affinityai.me/couples</strong> to get started.
                </p>
            </div>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 3</div>
    </div>

    <!-- Page 4: Personal Growth -->
    <div class="page">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Personal Growth Opportunities</h1>
                <p class="page-subtitle">Enhancing Your Relationship Success</p>
            </header>

            <div class="section">
                <h2 class="section-title">Balancing Idealism with Reality</h2>
                <p class="section-content">Your romantic idealism is beautiful, but learning to appreciate imperfect moments can deepen your relationships and increase satisfaction.</p>
                <p class="section-content">${style.advice}</p>
                <ul class="bullet-list">
                    <li class="bullet-item">Practice gratitude for ordinary moments with your partner</li>
                    <li class="bullet-item">Find beauty in practical acts of love (doing dishes, paying bills together)</li>
                    <li class="bullet-item">Celebrate small gestures, not just grand romantic moments</li>
                    <li class="bullet-item">Learn to see conflict as part of your love story, not a threat to it</li>
                </ul>
            </div>

            <div class="section">
                <h2 class="section-title">Developing Emotional Resilience</h2>
                <p class="section-content">Your deep feeling nature is a gift, but building resilience helps you navigate relationship challenges without losing your sensitivity.</p>
                
                <div class="highlight-box">
                    <div class="highlight-title">Resilience Practice</div>
                    <p>When facing relationship stress, ask yourself: "How can this challenge become part of our growth story?" This reframes difficulties as opportunities for deeper connection.</p>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Setting Healthy Boundaries</h2>
                <p class="section-content">Your empathetic nature can sometimes lead to over-giving or losing yourself in relationships. Healthy boundaries actually enhance intimacy by ensuring both partners remain whole individuals.</p>
                <p class="section-content">Finding this balance is especially important for someone with your ${style.tone} approach to relationships.</p>
                <ul class="bullet-list">
                    <li class="bullet-item">Maintain individual interests and friendships outside the relationship</li>
                    <li class="bullet-item">Communicate your needs directly rather than hoping your partner will intuit them</li>
                    <li class="bullet-item">Take regular time for emotional self-care and personal processing</li>
                    <li class="bullet-item">Remember that healthy relationships include both togetherness and autonomy</li>
                </ul>
            </div>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 4</div>
    </div>

    <!-- Page 5: Action Steps -->
    <div class="page">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Your Next Steps</h1>
                <p class="page-subtitle">Putting Insights Into Action</p>
            </header>

            <div class="section">
                <h2 class="section-title">This Week: Immediate Actions</h2>
                <ul class="bullet-list">
                    <li class="bullet-item">Share one meaningful story from your past with someone you care about</li>
                    <li class="bullet-item">Practice expressing a practical need directly in your ${style.tone} way</li>
                    <li class="bullet-item">Notice and appreciate one "ordinary" moment of connection</li>
                    <li class="bullet-item">Ask someone you're dating or in a relationship with one of the conversation starters from this report</li>
                </ul>
            </div>

            <div class="section">
                <h2 class="section-title">This Month: Building New Patterns</h2>
                <ul class="bullet-list">
                    <li class="bullet-item">Establish a weekly ritual of connection with your partner (or plan for future relationships)</li>
                    <li class="bullet-item">Practice setting one small boundary while maintaining emotional openness</li>
                    <li class="bullet-item">Reflect on your relationship patterns and identify one area for growth</li>
                    <li class="bullet-item">Plan a date or activity that aligns with your authentic interests and values</li>
                </ul>
            </div>

            <div class="section">
                <h2 class="section-title">Ongoing: Long-term Growth</h2>
                <ul class="bullet-list">
                    <li class="bullet-item">Develop a consistent practice of emotional self-care and processing</li>
                    <li class="bullet-item">Learn to appreciate expressions of love that might differ from your ${style.tone} preferences</li>
                    <li class="bullet-item">Build resilience by reframing challenges as part of your growth story</li>
                    <li class="bullet-item">Continue exploring your compatibility with different personality types</li>
                </ul>
            </div>

            <div class="highlight-box" style="margin-top: 20px;">
                <div class="highlight-title" style="text-align: center; font-size: 16px;">Remember</div>
                <p style="text-align: center; font-size: 14px; margin-top: 8px;">Your ${style.tone} approach to relationships is a gift. The right person will treasure these qualities, not ask you to diminish them.</p>
            </div>

            <!-- Couples Mode CTA -->
            <div class="couples-cta" style="margin-top: 20px;">
                <h3 class="couples-cta-title">Want to compare this with your partner's archetype?</h3>
                <p class="couples-cta-text">
                    Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit <strong>affinityai.me/couples</strong> to get started.
                </p>
            </div>

            <p style="text-align: center; margin-top: 15px; font-size: 14px; color: #6c5ce7; font-weight: 500;">
                Thank you for taking this journey of self-discovery. May your love story be everything you dream it can be.
            </p>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 5</div>
    </div>
    
    <!-- Page 6: Compatibility Radar -->
    <div class="page">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Your Compatibility Radar</h1>
                <p class="page-subtitle">Understanding How You Connect With Others</p>
            </header>

            <div class="section">
                <h2 class="section-title">Visualizing Your Compatibility</h2>
                <p class="section-content">
                    This radar chart shows your natural compatibility with each romantic archetype. The further the point extends outward, the stronger the compatibility.
                </p>
                
                <!-- Compatibility Radar Visualization -->
                <div style="display: flex; justify-content: center; margin: 15px 0;">
                    <svg width="300" height="300" viewBox="0 0 300 300" style="margin: 0 auto;">
                        <!-- Background circles -->
                        <circle cx="150" cy="150" r="150" fill="none" stroke="#e2e8f0" stroke-width="1" />
                        <circle cx="150" cy="150" r="112.5" fill="none" stroke="#e2e8f0" stroke-width="1" />
                        <circle cx="150" cy="150" r="75" fill="none" stroke="#e2e8f0" stroke-width="1" />
                        <circle cx="150" cy="150" r="37.5" fill="none" stroke="#e2e8f0" stroke-width="1" />
                        
                        <!-- Axis lines -->
                        <line x1="150" y1="0" x2="150" y2="300" stroke="#e2e8f0" stroke-width="1" />
                        <line x1="0" y1="150" x2="300" y2="150" stroke="#e2e8f0" stroke-width="1" />
                        <line x1="44" y1="44" x2="256" y2="256" stroke="#e2e8f0" stroke-width="1" />
                        <line x1="256" y1="44" x2="44" y2="256" stroke="#e2e8f0" stroke-width="1" />
                        
                        <!-- Data polygon -->
                        <polygon points="150,30 270,150 150,240 60,150" fill="rgba(108, 92, 231, 0.1)" stroke="#6c5ce7" stroke-width="2" />
                        
                        <!-- Center point -->
                        <circle cx="150" cy="150" r="3" fill="#6c5ce7" />
                        
                        <!-- Labels -->
                        <text x="150" y="15" text-anchor="middle" font-size="12" fill="#4a5568">Narrative Idealist</text>
                        <text x="285" y="155" text-anchor="start" font-size="12" fill="#4a5568">Vibrant Explorer</text>
                        <text x="150" y="295" text-anchor="middle" font-size="12" fill="#4a5568">Steady Guardian</text>
                        <text x="15" y="155" text-anchor="end" font-size="12" fill="#4a5568">Compassionate Nurturer</text>
                        <text x="75" y="75" text-anchor="middle" font-size="12" fill="#4a5568">Mindful Architect</text>
                    </svg>
                </div>
                
                <h2 class="section-title">Your Compatibility Scores</h2>
                <ul class="bullet-list">
                    <li class="bullet-item"><strong>Vibrant Explorer:</strong> 85% - Your depth pairs well with their spontaneity</li>
                    <li class="bullet-item"><strong>Steady Guardian:</strong> 75% - They provide stability for your emotional exploration</li>
                    <li class="bullet-item"><strong>Mindful Architect:</strong> 65% - You both value meaning, but approach it differently</li>
                    <li class="bullet-item"><strong>Compassionate Nurturer:</strong> 70% - You connect through emotional understanding</li>
                </ul>
                
                <div class="highlight-box">
                    <div class="highlight-title">Compatibility Insight</div>
                    <p>Remember that compatibility is just one factor in successful relationships. Growth, communication, and shared values are equally important. The right relationship often involves complementary differences, not just similarities.</p>
                </div>
            </div>

            <!-- Couples Mode CTA -->
            <div class="couples-cta">
                <h3 class="couples-cta-title">Want to compare this with your partner's archetype?</h3>
                <p class="couples-cta-text">
                    Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit <strong>affinityai.me/couples</strong> to get started.
                </p>
            </div>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 6</div>
    </div>

    <!-- Page 7: Physical Intimacy & Attraction -->
    <div class="page">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Physical Intimacy & Attraction</h1>
                <p class="page-subtitle">Understanding Your Approach to Physical Connection</p>
            </header>

            <div class="section">
                <h2 class="section-title">Your Physical Connection Style</h2>
                <p class="section-content">As a ${archetype.name}, your approach to physical intimacy is influenced by your overall relationship style. ${getRandomPhrase()}, and this extends to how you experience physical connection.</p>
                
                <div style="background: #fef5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 15px; margin: 15px 0; border-left: 4px solid #e53e3e;">
                    <div style="font-weight: 600; color: #c53030; margin-bottom: 6px;">Your Intimacy Language</div>
                    <p style="color: #742a2a; line-height: 1.5; font-size: 13px;">For you, physical intimacy is most meaningful when it's an extension of emotional connection. You value the story behind each touch and the meaning behind physical expressions of love. While others might separate physical and emotional attraction, for you they're deeply intertwined.</p>
                </div>
                
                <p class="section-content">Your physical intimacy style tends to be:</p>
                <ul class="bullet-list">
                    <li class="bullet-item">Emotionally present and fully engaged in the moment</li>
                    <li class="bullet-item">Focused on the meaning and connection behind physical touch</li>
                    <li class="bullet-item">Appreciative of sensual experiences that engage all senses</li>
                    <li class="bullet-item">Drawn to partners who can verbalize their feelings during intimate moments</li>
                    <li class="bullet-item">Most comfortable when trust and emotional safety are established first</li>
                </ul>
            </div>

            <div class="section">
                <h2 class="section-title">Enhancing Physical Connection</h2>
                <p class="section-content">To create more fulfilling physical intimacy in your relationships:</p>
                
                <ul class="bullet-list">
                    <li class="bullet-item">Communicate your desire for emotional connection alongside physical intimacy</li>
                    <li class="bullet-item">Create rituals that help you transition from daily life to intimate moments</li>
                    <li class="bullet-item">Express appreciation for your partner's physical expressions of love, even simple ones</li>
                    <li class="bullet-item">Be open about what helps you feel emotionally safe during intimate moments</li>
                    <li class="bullet-item">Remember that physical connection can be a language of its own, complementing verbal communication</li>
                </ul>
                
                <div class="highlight-box">
                    <div class="highlight-title">Intimacy Insight</div>
                    <p>For someone with your ${style.tone} nature, physical intimacy is most fulfilling when it feels like an authentic expression of your emotional connection. Creating the right conditions for this alignment will enhance both physical and emotional satisfaction.</p>
                </div>
            </div>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 7</div>
    </div>

    <!-- Page 8: Relationship Patterns & Cycles -->
    <div class="page">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Relationship Patterns & Cycles</h1>
                <p class="page-subtitle">Understanding Your Relationship Journey</p>
            </header>

            <div class="section">
                <h2 class="section-title">Your Relationship Cycle</h2>
                <p class="section-content">As a ${archetype.name}, you tend to move through relationships in a pattern that reflects your ${style.tone} nature. Understanding this cycle can help you navigate relationships more consciously.</p>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 15px 0;">
                    <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 12px;">
                        <div style="font-weight: 600; color: #2b6cb0; margin-bottom: 6px; font-size: 14px;">Initial Connection</div>
                        <p style="color: #2c5282; font-size: 12px; line-height: 1.4;">You're drawn to people who show depth, authenticity, and emotional intelligence. You value meaningful early conversations over surface-level small talk.</p>
                    </div>
                    
                    <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 12px;">
                        <div style="font-weight: 600; color: #2b6cb0; margin-bottom: 6px; font-size: 14px;">Building Intimacy</div>
                        <p style="color: #2c5282; font-size: 12px; line-height: 1.4;">You create closeness through deep conversations, shared experiences, and emotional vulnerability. This phase feels especially rewarding for you.</p>
                    </div>
                    
                    <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 12px;">
                        <div style="font-weight: 600; color: #2b6cb0; margin-bottom: 6px; font-size: 14px;">Challenge Point</div>
                        <p style="color: #2c5282; font-size: 12px; line-height: 1.4;">You may struggle when the relationship faces practical challenges or when everyday reality doesn't match your ideal vision. This is a growth opportunity.</p>
                    </div>
                    
                    <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 12px;">
                        <div style="font-weight: 600; color: #2b6cb0; margin-bottom: 6px; font-size: 14px;">Deepening or Transition</div>
                        <p style="color: #2c5282; font-size: 12px; line-height: 1.4;">If you navigate challenges successfully, your relationships reach a new level of authentic connection. If not, you may begin seeking a new connection.</p>
                    </div>
                </div>
                
                <p class="section-content">Being aware of this pattern can help you make conscious choices at each stage, especially during challenge points where your natural tendencies might create obstacles.</p>
            </div>

            <div class="section">
                <h2 class="section-title">Breaking Unhelpful Patterns</h2>
                <p class="section-content">If you've noticed recurring challenges in your relationships, consider these strategies to create new patterns:</p>
                
                <ul class="bullet-list">
                    <li class="bullet-item">Notice when you're idealizing a new partner and consciously balance this with realistic observations</li>
                    <li class="bullet-item">When feeling disappointed, ask yourself if your expectations were communicated clearly</li>
                    <li class="bullet-item">Practice staying engaged during practical discussions even when they feel mundane</li>
                    <li class="bullet-item">Create a personal ritual for processing relationship emotions before responding</li>
                    <li class="bullet-item">Identify your typical "exit point" in relationships and commit to working through that stage differently next time</li>
                </ul>
                
                <div class="highlight-box">
                    <div class="highlight-title">Pattern Breakthrough</div>
                    <p>The most powerful way to change relationship patterns is to recognize them as they're happening. When you notice yourself following a familiar script, pause and ask, "How could I respond differently this time?"</p>
                </div>
            </div>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 8</div>
    </div>
</body>
</html>`;

  return htmlContent;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('🔄 [PDF GENERATION] Starting beautiful PDF generation...');
    
    const { archetype, customerName, sessionId } = JSON.parse(event.body || '{}');

    if (!archetype) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing archetype data' }),
      };
    }

    console.log('📊 [PDF GENERATION] Generating PDF for archetype:', archetype.name);

    // Create the HTML content
    const htmlContent = createPDFHTML(archetype, customerName, sessionId);
    
    // Return the HTML content for client-side PDF generation
    const response = {
      html: htmlContent,
      filename: `${archetype.name.toLowerCase().replace(/\s+/g, '-')}-love-blueprint.pdf`,
      archetype: archetype.name,
      customerName: customerName || 'Valued Customer'
    };

    console.log('✅ [PDF GENERATION] HTML template generated successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error: any) {
    console.error('💥 [PDF GENERATION] Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'PDF generation failed',
        details: error.message
      }),
    };
  }
};

