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
        body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: #333;
            background: white;
            margin: 0;
            padding: 0;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 0 auto;
            background: white;
            position: relative;
            page-break-after: always;
        }
        
        .page:last-child {
            page-break-after: auto;
        }
        
        h1, h2, h3 {
            color: #6c5ce7;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        
        p {
            margin-bottom: 10px;
        }
        
        .highlight-box {
            background: #f0f4ff;
            border: 1px solid #d0d8ff;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #6c5ce7;
        }
        
        .couples-cta {
            background: #f0e6ff;
            border: 1px solid #d6bcfa;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #805ad5;
        }
        
        .compatibility-section {
            background: #f0fff4;
            border: 1px solid #c6f6d5;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .conversation-starters {
            background: #fffaf0;
            border: 1px solid #fed7aa;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }
        
        .page-number {
            position: absolute;
            bottom: 10mm;
            right: 10mm;
            font-size: 12px;
            color: #888;
        }
        
        ul {
            padding-left: 20px;
        }
        
        li {
            margin-bottom: 5px;
        }
        
        @media print {
            body {
                width: 210mm;
                height: 297mm;
            }
            
            .page {
                margin: 0;
                border: initial;
                border-radius: initial;
                width: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
                page-break-after: always;
            }
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="page">
        <h1 style="font-size: 28px; text-align: center; margin-top: 100px;">${archetype.name}: The Love Blueprint</h1>
        <p style="text-align: center; font-style: italic; margin-top: 20px;">"Co-authoring your love story with clarity and heart."</p>
        ${customerName ? `<p style="text-align: center; margin-top: 50px;">Prepared for ${customerName}</p>` : ''}
        <p style="text-align: center; margin-top: 20px;">${currentDate}</p>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Cover</div>
    </div>

    <!-- Page 1: Archetype Overview -->
    <div class="page">
        <h1>Your Archetype: ${archetype.name}</h1>
        <h2>Understanding Your Romantic Nature</h2>

        <h3>About Your Archetype</h3>
        <p>${archetype.description}</p>
        <p>${getRandomPhrase()}. This creates a unique dynamic in your relationships that others find both refreshing and meaningful.</p>
        
        <div class="highlight-box">
            <h3>Core Insight</h3>
            <p>You don't just experience love—you create meaningful connections that become the foundation of your personal story and identity.</p>
        </div>

        <h3>Your Core Characteristics</h3>
        <ul>
            ${archetype.keywords.map(keyword => `<li>${keyword.text} ${keyword.emoji}</li>`).join('')}
        </ul>

        <h3>Compatibility Overview</h3>
        <div class="compatibility-section">
            <h3>You tend to connect well with:</h3>
            <ul>
                ${archetype.compatibleWith.map(match => `<li>${match}</li>`).join('')}
            </ul>
            <p>These archetypes complement your ${archetype.name} nature by providing balance to your approach while appreciating your unique perspective on love and relationships.</p>
        </div>
        
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 1</div>
    </div>

    <!-- Page 2: Communication Style -->
    <div class="page">
        <h1>Your Communication Style</h1>
        <h2>How You Express and Receive Love</h2>

        <h3>Communication Strengths</h3>
        <p>As a ${archetype.name}, your communication is rich with emotion and meaning. You excel at creating emotional safety and expressing complex feelings.</p>
        <p>With your ${style.tone} communication style, you bring unique qualities to your conversations that create deeper understanding.</p>
        <ul>
            <li>Expressing emotions with poetic clarity and authenticity</li>
            <li>Active listening with genuine empathy and understanding</li>
            <li>Creating safe spaces for vulnerable conversations</li>
            <li>Reading between the lines and understanding emotional subtext</li>
            <li>Sharing personal stories that deepen intimacy</li>
        </ul>

        <h3>Areas for Growth</h3>
        <ul>
            <li>Being direct about practical needs and everyday concerns</li>
            <li>Discussing mundane topics without losing interest or engagement</li>
            <li>Addressing conflicts before they become emotionally overwhelming</li>
            <li>Balancing emotional expression with logical problem-solving</li>
        </ul>

        <h3>Conversation Starters</h3>
        <div class="conversation-starters">
            <h3>Questions designed for your ${archetype.name} nature:</h3>
            <p style="font-style: italic;">"What's a moment from your childhood that still influences how you love?"</p>
            <p style="font-style: italic;">"If our relationship were a book, what would this chapter be about?"</p>
            <p style="font-style: italic;">"What's something beautiful you noticed about us this week?"</p>
            <p style="font-style: italic;">"How do you imagine we'll look back on this time in our lives?"</p>
            <p style="font-style: italic;">"What's a dream you have for us that you haven't shared yet?"</p>
        </div>
        <p>These questions align with your ${style.tone} nature and will help you create the kind of meaningful conversations you naturally value.</p>
        
        <!-- Couples Mode CTA -->
        <div class="couples-cta">
            <h3>Want to compare this with your partner's archetype?</h3>
            <p>Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit <strong>affinityai.me/couples</strong> to get started.</p>
        </div>
        
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 2</div>
    </div>

    <!-- Page 3: Relationship Dynamics -->
    <div class="page">
        <h1>Your Relationship Dynamics</h1>
        <h2>Creating Lasting, Meaningful Connections</h2>

        <h3>Emotional Intimacy (Your Superpower)</h3>
        <p>You excel at creating deep emotional bonds. Your ideal relationship includes regular heart-to-heart conversations, shared vulnerability, and emotional attunement with your partner.</p>
        <p>${getRandomPhrase()}. This creates a foundation for the kind of meaningful connection you seek.</p>
        <ul>
            <li>Daily check-ins about feelings and meaningful experiences</li>
            <li>Shared rituals that create meaning (morning coffee talks, evening walks)</li>
            <li>Celebrating emotional milestones and relationship anniversaries</li>
            <li>Creating space for both partners to express vulnerability safely</li>
        </ul>

        <h3>Conflict Resolution Style</h3>
        <p>You prefer to address conflicts through emotional processing rather than purely logical problem-solving. While this creates deep understanding, it's important to balance emotion with practical solutions.</p>
        
        <div class="highlight-box">
            <h3>Effective Approach</h3>
            <p>Start with emotional validation and understanding, then move toward practical solutions together. This honors your ${style.tone} nature while ensuring issues get resolved effectively.</p>
        </div>

        <h3>Love Languages That Resonate</h3>
        <ul>
            <li><strong>Words of Affirmation:</strong> Poetic expressions of love and deep appreciation</li>
            <li><strong>Quality Time:</strong> Meaningful conversations and shared emotional experiences</li>
            <li><strong>Physical Touch:</strong> Affectionate gestures that convey emotional connection</li>
            <li><strong>Acts of Service:</strong> Thoughtful gestures that show understanding of your inner world</li>
            <li><strong>Receiving Gifts:</strong> Meaningful tokens that symbolize your unique connection</li>
        </ul>
        
        <!-- Couples Mode CTA -->
        <div class="couples-cta">
            <h3>Want to compare this with your partner's archetype?</h3>
            <p>Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit <strong>affinityai.me/couples</strong> to get started.</p>
        </div>
        
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 3</div>
    </div>

    <!-- Page 4: Personal Growth -->
    <div class="page">
        <h1>Personal Growth Opportunities</h1>
        <h2>Enhancing Your Relationship Success</h2>

        <h3>Balancing Idealism with Reality</h3>
        <p>Your romantic idealism is beautiful, but learning to appreciate imperfect moments can deepen your relationships and increase satisfaction.</p>
        <p>${style.advice}</p>
        <ul>
            <li>Practice gratitude for ordinary moments with your partner</li>
            <li>Find beauty in practical acts of love (doing dishes, paying bills together)</li>
            <li>Celebrate small gestures, not just grand romantic moments</li>
            <li>Learn to see conflict as part of your love story, not a threat to it</li>
        </ul>

        <h3>Developing Emotional Resilience</h3>
        <p>Your deep feeling nature is a gift, but building resilience helps you navigate relationship challenges without losing your sensitivity.</p>
        
        <div class="highlight-box">
            <h3>Resilience Practice</h3>
            <p>When facing relationship stress, ask yourself: "How can this challenge become part of our growth story?" This reframes difficulties as opportunities for deeper connection.</p>
        </div>

        <h3>Setting Healthy Boundaries</h3>
        <p>Your empathetic nature can sometimes lead to over-giving or losing yourself in relationships. Healthy boundaries actually enhance intimacy by ensuring both partners remain whole individuals.</p>
        <p>Finding this balance is especially important for someone with your ${style.tone} approach to relationships.</p>
        <ul>
            <li>Maintain individual interests and friendships outside the relationship</li>
            <li>Communicate your needs directly rather than hoping your partner will intuit them</li>
            <li>Take regular time for emotional self-care and personal processing</li>
            <li>Remember that healthy relationships include both togetherness and autonomy</li>
        </ul>
        
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 4</div>
    </div>

    <!-- Page 5: Action Steps -->
    <div class="page">
        <h1>Your Next Steps</h1>
        <h2>Putting Insights Into Action</h2>

        <h3>This Week: Immediate Actions</h3>
        <ul>
            <li>Share one meaningful story from your past with someone you care about</li>
            <li>Practice expressing a practical need directly in your ${style.tone} way</li>
            <li>Notice and appreciate one "ordinary" moment of connection</li>
            <li>Ask someone you're dating or in a relationship with one of the conversation starters from this report</li>
        </ul>

        <h3>This Month: Building New Patterns</h3>
        <ul>
            <li>Establish a weekly ritual of connection with your partner (or plan for future relationships)</li>
            <li>Practice setting one small boundary while maintaining emotional openness</li>
            <li>Reflect on your relationship patterns and identify one area for growth</li>
            <li>Plan a date or activity that aligns with your authentic interests and values</li>
        </ul>

        <h3>Ongoing: Long-term Growth</h3>
        <ul>
            <li>Develop a consistent practice of emotional self-care and processing</li>
            <li>Learn to appreciate expressions of love that might differ from your ${style.tone} preferences</li>
            <li>Build resilience by reframing challenges as part of your growth story</li>
            <li>Continue exploring your compatibility with different personality types</li>
        </ul>

        <div class="highlight-box">
            <h3 style="text-align: center;">Remember</h3>
            <p style="text-align: center;">Your ${style.tone} approach to relationships is a gift. The right person will treasure these qualities, not ask you to diminish them.</p>
        </div>

        <!-- Couples Mode CTA -->
        <div class="couples-cta">
            <h3>Want to compare this with your partner's archetype?</h3>
            <p>Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit <strong>affinityai.me/couples</strong> to get started.</p>
        </div>

        <p style="text-align: center; margin-top: 20px; color: #6c5ce7; font-weight: bold;">
            Thank you for taking this journey of self-discovery. May your love story be everything you dream it can be.
        </p>
        
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 5</div>
    </div>
    
    <!-- Page 6: Compatibility Radar -->
    <div class="page">
        <h1>Your Compatibility Radar</h1>
        <h2>Understanding How You Connect With Others</h2>

        <h3>Visualizing Your Compatibility</h3>
        <p>This radar chart shows your natural compatibility with each romantic archetype. The further the point extends outward, the stronger the compatibility.</p>
        
        <!-- Simple Compatibility Radar Visualization -->
        <div style="text-align: center; margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
            <div style="width: 300px; height: 300px; margin: 0 auto; position: relative; border: 1px solid #e2e8f0; border-radius: 50%;">
                <!-- Simplified radar visualization using HTML/CSS -->
                <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); text-align: center;">
                    <p style="margin: 0; padding: 5px; background: white;">Narrative Idealist</p>
                </div>
                <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); text-align: center;">
                    <p style="margin: 0; padding: 5px; background: white;">Steady Guardian</p>
                </div>
                <div style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); text-align: center;">
                    <p style="margin: 0; padding: 5px; background: white;">Compassionate Nurturer</p>
                </div>
                <div style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); text-align: center;">
                    <p style="margin: 0; padding: 5px; background: white;">Vibrant Explorer</p>
                </div>
                <div style="position: absolute; top: 25%; left: 25%; transform: translate(-50%, -50%); text-align: center;">
                    <p style="margin: 0; padding: 5px; background: white;">Mindful Architect</p>
                </div>
                
                <!-- Compatibility polygon -->
                <div style="position: absolute; top: 50%; left: 50%; width: 200px; height: 200px; transform: translate(-50%, -50%); clip-path: polygon(50% 10%, 90% 50%, 50% 80%, 20% 50%); background-color: rgba(108, 92, 231, 0.2); border: 2px solid #6c5ce7;"></div>
            </div>
            <p style="font-size: 12px; color: #888; margin-top: 10px;">Your Compatibility Radar: Showing relative compatibility with different archetypes</p>
        </div>
        
        <h3>Your Compatibility Scores</h3>
        <ul>
            <li><strong>Vibrant Explorer:</strong> 85% - Your depth pairs well with their spontaneity</li>
            <li><strong>Steady Guardian:</strong> 75% - They provide stability for your emotional exploration</li>
            <li><strong>Mindful Architect:</strong> 65% - You both value meaning, but approach it differently</li>
            <li><strong>Compassionate Nurturer:</strong> 70% - You connect through emotional understanding</li>
        </ul>
        
        <div class="highlight-box">
            <h3>Compatibility Insight</h3>
            <p>Remember that compatibility is just one factor in successful relationships. Growth, communication, and shared values are equally important. The right relationship often involves complementary differences, not just similarities.</p>
        </div>

        <!-- Couples Mode CTA -->
        <div class="couples-cta">
            <h3>Want to compare this with your partner's archetype?</h3>
            <p>Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit <strong>affinityai.me/couples</strong> to get started.</p>
        </div>
        
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 6</div>
    </div>

    <!-- Page 7: Physical Intimacy & Attraction -->
    <div class="page">
        <h1>Physical Intimacy & Attraction</h1>
        <h2>Understanding Your Approach to Physical Connection</h2>

        <h3>Your Physical Connection Style</h3>
        <p>As a ${archetype.name}, your approach to physical intimacy is influenced by your overall relationship style. ${getRandomPhrase()}, and this extends to how you experience physical connection.</p>
        
        <div style="background: #fef5f5; border: 1px solid #fed7d7; border-radius: 5px; padding: 15px; margin: 15px 0; border-left: 4px solid #e53e3e;">
            <h3>Your Intimacy Language</h3>
            <p>For you, physical intimacy is most meaningful when it's an extension of emotional connection. You value the story behind each touch and the meaning behind physical expressions of love. While others might separate physical and emotional attraction, for you they're deeply intertwined.</p>
        </div>
        
        <p>Your physical intimacy style tends to be:</p>
        <ul>
            <li>Emotionally present and fully engaged in the moment</li>
            <li>Focused on the meaning and connection behind physical touch</li>
            <li>Appreciative of sensual experiences that engage all senses</li>
            <li>Drawn to partners who can verbalize their feelings during intimate moments</li>
            <li>Most comfortable when trust and emotional safety are established first</li>
        </ul>

        <h3>Enhancing Physical Connection</h3>
        <p>To create more fulfilling physical intimacy in your relationships:</p>
        
        <ul>
            <li>Communicate your desire for emotional connection alongside physical intimacy</li>
            <li>Create rituals that help you transition from daily life to intimate moments</li>
            <li>Express appreciation for your partner's physical expressions of love, even simple ones</li>
            <li>Be open about what helps you feel emotionally safe during intimate moments</li>
            <li>Remember that physical connection can be a language of its own, complementing verbal communication</li>
        </ul>
        
        <div class="highlight-box">
            <h3>Intimacy Insight</h3>
            <p>For someone with your ${style.tone} nature, physical intimacy is most fulfilling when it feels like an authentic expression of your emotional connection. Creating the right conditions for this alignment will enhance both physical and emotional satisfaction.</p>
        </div>
        
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 7</div>
    </div>

    <!-- Page 8: Relationship Patterns & Cycles -->
    <div class="page">
        <h1>Relationship Patterns & Cycles</h1>
        <h2>Understanding Your Relationship Journey</h2>

        <h3>Your Relationship Cycle</h3>
        <p>As a ${archetype.name}, you tend to move through relationships in a pattern that reflects your ${style.tone} nature. Understanding this cycle can help you navigate relationships more consciously.</p>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 15px 0;">
            <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 5px; padding: 12px;">
                <h4 style="margin-top: 0;">Initial Connection</h4>
                <p style="font-size: 14px;">You're drawn to people who show depth, authenticity, and emotional intelligence. You value meaningful early conversations over surface-level small talk.</p>
            </div>
            
            <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 5px; padding: 12px;">
                <h4 style="margin-top: 0;">Building Intimacy</h4>
                <p style="font-size: 14px;">You create closeness through deep conversations, shared experiences, and emotional vulnerability. This phase feels especially rewarding for you.</p>
            </div>
            
            <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 5px; padding: 12px;">
                <h4 style="margin-top: 0;">Challenge Point</h4>
                <p style="font-size: 14px;">You may struggle when the relationship faces practical challenges or when everyday reality doesn't match your ideal vision. This is a growth opportunity.</p>
            </div>
            
            <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 5px; padding: 12px;">
                <h4 style="margin-top: 0;">Deepening or Transition</h4>
                <p style="font-size: 14px;">If you navigate challenges successfully, your relationships reach a new level of authentic connection. If not, you may begin seeking a new connection.</p>
            </div>
        </div>
        
        <p>Being aware of this pattern can help you make conscious choices at each stage, especially during challenge points where your natural tendencies might create obstacles.</p>

        <h3>Breaking Unhelpful Patterns</h3>
        <p>If you've noticed recurring challenges in your relationships, consider these strategies to create new patterns:</p>
        
        <ul>
            <li>Notice when you're idealizing a new partner and consciously balance this with realistic observations</li>
            <li>When feeling disappointed, ask yourself if your expectations were communicated clearly</li>
            <li>Practice staying engaged during practical discussions even when they feel mundane</li>
            <li>Create a personal ritual for processing relationship emotions before responding</li>
            <li>Identify your typical "exit point" in relationships and commit to working through that stage differently next time</li>
        </ul>
        
        <div class="highlight-box">
            <h3>Pattern Breakthrough</h3>
            <p>The most powerful way to change relationship patterns is to recognize them as they're happening. When you notice yourself following a familiar script, pause and ask, "How could I respond differently this time?"</p>
        </div>
        
        <!-- Couples Mode CTA -->
        <div class="couples-cta">
            <h3>Ready to deepen your relationship insights?</h3>
            <p>Visit <strong>affinityai.me/couples</strong> to discover how your archetype interacts with your partner's and receive personalized guidance for your unique relationship dynamic.</p>
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
    console.log('🔄 [PDF GENERATION] Starting PDF generation...');
    
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

