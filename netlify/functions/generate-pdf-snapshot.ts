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
  
  return `
<!DOCTYPE html>
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
            padding: 12mm;
            margin: 0 auto;
            background: white;
            page-break-after: always !important;
            position: relative;
        }
        
        .page:last-child {
            page-break-after: avoid !important;
        }
        
        /* Cover Page Styles */
        .cover-page {
            padding: 20px;
            text-align: center !important;
            min-height: 90% !important;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #f8f9ff 0%, #e6f3ff 100%);
            border-radius: 12px;
            padding: 40px;
        }
        
        .cover-title {
            font-size: 48px;
            font-weight: 700;
            color: #6c5ce7;
            margin-bottom: 16px;
            letter-spacing: -0.02em;
        }
        
        .cover-subtitle {
            font-size: 24px;
            color: #6c5ce7;
            margin-bottom: 40px;
            font-weight: 400;
        }
        
        .cover-archetype {
            font-size: 36px;
            font-weight: 600;
            color: #fd79a8;
            margin-bottom: 16px;
        }
        
        .cover-tagline {
            font-size: 20px;
            font-style: italic;
            color: #6c5ce7;
            margin-bottom: 60px;
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
            padding-bottom: 20px;
            margin-bottom: 40px;
        }
        
        .page-title {
            font-size: 32px;
            font-weight: 700;
            color: #6c5ce7;
            margin-bottom: 8px;
        }
        
        .page-subtitle {
            font-size: 16px;
            color: #718096;
        }
        
        .section {
            margin-bottom: 32px;
            page-break-inside: avoid !important;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 16px;
            padding-left: 16px;
            border-left: 4px solid #6c5ce7;
        }
        
        .section-content {
            font-size: 14px;
            line-height: 1.7;
            color: #4a5568;
            margin-bottom: 16px;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #f8f9ff 0%, #e6f3ff 100%);
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #6c5ce7;
            page-break-inside: avoid !important;
        }
        
        .highlight-title {
            font-weight: 600;
            color: #6c5ce7;
            margin-bottom: 8px;
        }
        
        .keywords-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin: 20px 0;
            page-break-inside: avoid !important;
        }
        
        .keyword-item {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px 16px;
            text-align: center;
            font-weight: 500;
            color: #4a5568;
        }
        
        .compatibility-section {
            background: #f0fff4;
            border: 1px solid #c6f6d5;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            page-break-inside: avoid !important;
        }
        
        .compatibility-title {
            color: #2f855a;
            font-weight: 600;
            margin-bottom: 12px;
        }
        
        .compatibility-list {
            list-style: none;
            padding: 0;
        }
        
        .compatibility-item {
            background: white;
            border: 1px solid #c6f6d5;
            border-radius: 4px;
            padding: 8px 12px;
            margin: 4px 0;
            color: #2f855a;
            font-weight: 500;
        }
        
        .bullet-list {
            list-style: none;
            padding: 0;
            margin: 16px 0;
        }
        
        .bullet-item {
            position: relative;
            padding-left: 24px;
            margin-bottom: 8px;
            color: #4a5568;
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
            padding: 20px;
            margin: 20px 0;
            page-break-inside: avoid !important;
        }
        
        .conversation-title {
            color: #c05621;
            font-weight: 600;
            margin-bottom: 12px;
        }
        
        .conversation-item {
            background: white;
            border: 1px solid #fed7aa;
            border-radius: 4px;
            padding: 12px;
            margin: 8px 0;
            font-style: italic;
            color: #744210;
        }
        
        .footer {
            position: absolute;
            bottom: 20mm;
            left: 20mm;
            right: 20mm;
            text-align: center;
            font-size: 12px;
            color: #a0aec0;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
        }
        
        .page-number {
            position: absolute;
            bottom: 10mm;
            right: 20mm;
            font-size: 12px;
            color: #a0aec0;
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
                page-break-after: always !important;
                page-break-before: auto !important;
            }
            
            .section {
                page-break-inside: avoid !important;
            }
            
            .highlight-box, .compatibility-section, .conversation-starters {
                page-break-inside: avoid !important;
            }
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="page">
        <div class="cover-page" style="page-break-after: always !important;">
            <h1 class="cover-title">Love Blueprint</h1>
            <p class="cover-subtitle">Your Personalized Relationship Profile</p>
            <h2 class="cover-archetype">${archetype.name}</h2>
            <p class="cover-tagline">"${archetype.tagline}"</p>
            ${customerName ? `<p class="cover-customer">Prepared for ${customerName}</p>` : ''}
            <p class="cover-date">${currentDate}</p>
        </div>
    </div>

    <!-- Page 1: Archetype Overview -->
    <div class="page" style="page-break-after: always !important;">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Your Archetype: ${archetype.name}</h1>
                <p class="page-subtitle">Understanding Your Romantic Nature</p>
            </header>

            <div class="section">
                <h2 class="section-title">About Your Archetype</h2>
                <p class="section-content">${archetype.description}</p>
                
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
                        ${archetype.compatibleWith.map(match => `
                            <li class="compatibility-item">${match}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 1</div>
    </div>

    <!-- Page 2: Communication Style -->
    <div class="page" style="page-break-after: always !important;">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Your Communication Style</h1>
                <p class="page-subtitle">How You Express and Receive Love</p>
            </header>

            <div class="section">
                <h2 class="section-title">Communication Strengths</h2>
                <p class="section-content">As a ${archetype.name}, your communication is rich with emotion and meaning. You excel at creating emotional safety and expressing complex feelings.</p>
                
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
            </div>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 2</div>
    </div>

    <!-- Page 3: Relationship Dynamics -->
    <div class="page" style="page-break-after: always !important;">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Your Relationship Dynamics</h1>
                <p class="page-subtitle">Creating Lasting, Meaningful Connections</p>
            </header>

            <div class="section">
                <h2 class="section-title">Emotional Intimacy (Your Superpower)</h2>
                <p class="section-content">You excel at creating deep emotional bonds. Your ideal relationship includes regular heart-to-heart conversations, shared vulnerability, and emotional attunement with your partner.</p>
                
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
                    <p>Start with emotional validation and understanding, then move toward practical solutions together. This honors your emotional nature while ensuring issues get resolved.</p>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Love Languages That Resonate</h2>
                <ul class="bullet-list">
                    <li class="bullet-item"><strong>Words of Affirmation:</strong> Poetic expressions of love and deep appreciation</li>
                    <li class="bullet-item"><strong>Quality Time:</strong> Meaningful conversations and shared emotional experiences</li>
                    <li class="bullet-item"><strong>Physical Touch:</strong> Affectionate gestures that convey emotional connection</li>
                    <li class="bullet-item"><strong>Acts of Service:</strong> Thoughtful gestures that show understanding of your inner world</li>
                </ul>
            </div>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 3</div>
    </div>

    <!-- Page 4: Personal Growth -->
    <div class="page" style="page-break-after: always !important;">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Personal Growth Opportunities</h1>
                <p class="page-subtitle">Enhancing Your Relationship Success</p>
            </header>

            <div class="section">
                <h2 class="section-title">Balancing Idealism with Reality</h2>
                <p class="section-content">Your romantic idealism is beautiful, but learning to appreciate imperfect moments can deepen your relationships and increase satisfaction.</p>
                
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
    <div class="page" style="page-break-after: avoid !important;">
        <div class="content-page">
            <header class="page-header">
                <h1 class="page-title">Your Next Steps</h1>
                <p class="page-subtitle">Putting Insights Into Action</p>
            </header>

            <div class="section">
                <h2 class="section-title">This Week: Immediate Actions</h2>
                <ul class="bullet-list">
                    <li class="bullet-item">Share one meaningful story from your past with someone you care about</li>
                    <li class="bullet-item">Practice expressing a practical need directly rather than hoping it will be intuited</li>
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
                    <li class="bullet-item">Learn to appreciate the beauty in practical expressions of love</li>
                    <li class="bullet-item">Build resilience by reframing challenges as part of your growth story</li>
                    <li class="bullet-item">Continue exploring your compatibility with different personality types</li>
                </ul>
            </div>

            <div class="highlight-box" style="margin-top: 30px;">
                <div class="highlight-title" style="text-align: center; font-size: 16px;">Remember</div>
                <p style="text-align: center; font-size: 14px; margin-top: 10px;">Your depth and emotional intelligence are gifts. The right person will treasure these qualities, not ask you to diminish them.</p>
            </div>

            <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #6c5ce7; font-weight: 500;">
                Thank you for taking this journey of self-discovery. May your love story be everything you dream it can be.
            </p>
        </div>
        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">Page 5</div>
    </div>
</body>
</html>
  `;
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