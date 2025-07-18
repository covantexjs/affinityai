import { Handler } from '@netlify/functions';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

// HTML template for the PDF
const generateHtmlTemplate = (archetypeName: string, archetypeTagline: string, compatibleWith: string, customerName?: string) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${archetypeName} Love Blueprint</title>
      <style>
        @page {
          margin: 0;
          size: A4;
        }
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          color: #2d3748;
          line-height: 1.5;
        }
        .page {
          width: 210mm;
          height: 297mm;
          padding: 20mm;
          position: relative;
          page-break-after: always;
          box-sizing: border-box;
        }
        .cover-page {
          background-color: #f8f9ff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 100%;
        }
        .cover-title {
          font-size: 36pt;
          font-weight: bold;
          color: #6c5ce7;
          margin-bottom: 20pt;
        }
        .cover-subtitle {
          font-size: 18pt;
          color: #6c5ce7;
          margin-bottom: 40pt;
        }
        .cover-archetype {
          font-size: 28pt;
          font-weight: bold;
          color: #fd79a8;
          margin-bottom: 20pt;
        }
        .cover-tagline {
          font-size: 16pt;
          font-style: italic;
          color: #6c5ce7;
          margin-bottom: 50pt;
        }
        .cover-customer {
          font-size: 14pt;
          color: #4a5568;
          margin-top: 50pt;
        }
        .cover-date {
          font-size: 12pt;
          color: #718096;
          margin-top: 14pt;
        }
        .section-title {
          font-size: 18pt;
          font-weight: bold;
          color: #6c5ce7;
          margin-bottom: 15pt;
          padding-bottom: 5pt;
          border-bottom: 1pt solid #e2e8f0;
        }
        .subsection-title {
          font-size: 14pt;
          font-weight: bold;
          color: #4a5568;
          margin-top: 15pt;
          margin-bottom: 10pt;
        }
        .paragraph {
          font-size: 11pt;
          margin-bottom: 10pt;
        }
        .highlight-box {
          background-color: #f8f9ff;
          padding: 15pt;
          margin: 15pt 0;
          border-left: 5pt solid #6c5ce7;
          border-radius: 5pt;
        }
        .highlight-text {
          font-size: 11pt;
          color: #4a5568;
          font-style: italic;
        }
        .compatibility-box {
          background-color: #f0fff4;
          padding: 15pt;
          margin: 15pt 0;
          border-radius: 5pt;
          border-left: 5pt solid #38a169;
        }
        .compatibility-title {
          font-size: 13pt;
          font-weight: bold;
          color: #2f855a;
          margin-bottom: 10pt;
        }
        .compatibility-text {
          font-size: 11pt;
          color: #2f855a;
        }
        .couples-cta-box {
          background-color: #f0e6ff;
          padding: 15pt;
          margin: 15pt 0;
          border-radius: 5pt;
          border-left: 5pt solid #805ad5;
        }
        .couples-cta-title {
          font-size: 13pt;
          font-weight: bold;
          color: #553c9a;
          margin-bottom: 10pt;
        }
        .couples-cta-text {
          font-size: 11pt;
          color: #553c9a;
        }
        .list {
          margin-left: 20pt;
          margin-bottom: 15pt;
        }
        .list-item {
          font-size: 11pt;
          margin-bottom: 5pt;
        }
        .page-number {
          position: absolute;
          bottom: 10mm;
          right: 10mm;
          font-size: 9pt;
          color: #a0aec0;
        }
        .footer {
          position: absolute;
          bottom: 10mm;
          left: 10mm;
          right: 10mm;
          text-align: center;
          font-size: 8pt;
          color: #a0aec0;
        }
        .radar-container {
          width: 100%;
          height: 300pt;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 20pt 0;
        }
        .radar-svg {
          width: 250pt;
          height: 250pt;
        }
        .radar-legend {
          margin-top: 10pt;
          font-size: 9pt;
          color: #4a5568;
          text-align: center;
        }
        .conversation-box {
          background-color: #fffaf0;
          padding: 15pt;
          margin: 15pt 0;
          border-radius: 5pt;
          border-left: 5pt solid #ed8936;
        }
        .conversation-title {
          font-size: 13pt;
          font-weight: bold;
          color: #c05621;
          margin-bottom: 10pt;
        }
        .conversation-item {
          font-size: 10pt;
          color: #744210;
          font-style: italic;
          margin-bottom: 5pt;
          padding-left: 10pt;
        }
      </style>
    </head>
    <body>
      <!-- Cover Page -->
      <div class="page cover-page">
        <div class="cover-title">Love Blueprint</div>
        <div class="cover-subtitle">Your AI-Enhanced Relationship Profile</div>
        <div class="cover-archetype">${archetypeName}</div>
        <div class="cover-tagline">"${archetypeTagline}"</div>
        ${customerName ? `<div class="cover-customer">Prepared for ${customerName}</div>` : ''}
        <div class="cover-date">${currentDate}</div>
        <div class="page-number">1</div>
      </div>

      <!-- Page 2: Personalized Overview -->
      <div class="page">
        <div class="section-title">Your Unique Love Profile</div>
        <div class="paragraph">
          As a ${archetypeName}, you bring a unique perspective to relationships that combines emotional depth, authenticity, and meaningful connection. 
          Your approach to love is deeply personal and meaningful.
        </div>
        
        <div class="highlight-box">
          <div class="highlight-text">
            As a ${archetypeName}, you don't just experience love—you create meaningful connections that become the foundation of your personal story and identity. Your approach to relationships is both deeply personal and universally resonant.
          </div>
        </div>

        <div class="section-title">Your Relationship Strengths</div>
        <div class="paragraph">
          These key strengths define how you show up in relationships and what makes you a valuable partner:
        </div>
        <div class="list">
          <div class="list-item">• Deep emotional intelligence and empathy</div>
          <div class="list-item">• Ability to create meaningful connections</div>
          <div class="list-item">• Strong commitment to authentic relationships</div>
          <div class="list-item">• Natural storytelling ability that enriches relationships</div>
          <div class="list-item">• Capacity for profound emotional intimacy</div>
        </div>

        <div class="section-title">Compatibility Overview</div>
        <div class="compatibility-box">
          <div class="compatibility-title">Your Perfect Match</div>
          <div class="compatibility-text">
            You naturally connect well with: ${compatibleWith}
          </div>
          <div class="compatibility-text" style="margin-top: 10pt;">
            In real-world terms, you'll likely click with people who are spontaneous and adventurous (Vibrant Explorer types) or those who provide stability and reliability (Steady Guardian types). These personalities balance your thoughtful, meaning-focused approach with either exciting new experiences or grounding practicality.
          </div>
        </div>
        
        <!-- Couples CTA - Added to Page 2 -->
        <div class="couples-cta-box">
          <div class="couples-cta-title">Want to compare this with your partner's archetype?</div>
          <div class="couples-cta-text">
            Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit affinityai.me/couples to get started.
          </div>
        </div>

        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">2</div>
      </div>

      <!-- Page 3: Communication Style -->
      <div class="page">
        <div class="section-title">Your Communication Style</div>
        <div class="paragraph">
          As a ${archetypeName}, your way of talking and listening is unique. You naturally go beyond small talk to create meaningful conversations that build real connection.
        </div>
        
        <div class="subsection-title">Your Communication Superpowers</div>
        <div class="list">
          <div class="list-item">• Expressing emotions with clarity and authenticity</div>
          <div class="list-item">• Active listening with genuine empathy</div>
          <div class="list-item">• Creating safe spaces for vulnerable conversations</div>
          <div class="list-item">• Understanding emotional subtext and nuance</div>
        </div>
        
        <div class="subsection-title">Communication Blind Spots</div>
        <div class="list">
          <div class="list-item">• Being direct about practical needs</div>
          <div class="list-item">• Discussing mundane topics without losing interest</div>
          <div class="list-item">• Addressing conflicts before they escalate</div>
        </div>

        <div class="highlight-box">
          <div class="highlight-text">
            Pro Tip: Your depth of communication is a gift. When you need something practical (like deciding where to eat or setting a schedule), try being direct and specific rather than hoping your partner will sense what you need. Save the poetic language for the emotional moments where it truly shines.
          </div>
        </div>

        <div class="section-title">Your Conflict Style</div>
        <div class="paragraph">
          When disagreements happen, you tend to focus on feelings first. Instead of jumping to solutions, you want to make sure everyone feels heard and understood.
        </div>
        
        <div class="paragraph">
          This approach has real benefits - it creates emotional safety and deeper understanding. But sometimes it can leave practical problems unsolved or drag conflicts out longer than necessary.
        </div>
        
        <div class="highlight-box">
          <div class="highlight-text">
            Try This: When conflicts arise, start by saying "I hear you and I understand how you feel" to create emotional safety. Then add "Let's figure out a solution together" to move toward resolution. This two-step approach honors both emotional needs and practical problem-solving.
          </div>
        </div>

        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">3</div>
      </div>

      <!-- Page 4: Compatibility Radar -->
      <div class="page">
        <div class="section-title">Your Compatibility Radar</div>
        <div class="paragraph">
          This visualization shows your natural compatibility with different relationship archetypes. The further the point extends outward on each axis, the stronger the compatibility.
        </div>
        
        <!-- Compatibility Radar Chart -->
        <div class="radar-container">
          <svg class="radar-svg" viewBox="0 0 200 200">
            <!-- Grid Circles -->
            <circle cx="100" cy="100" r="20" stroke="#e2e8f0" stroke-width="1" fill="none" />
            <circle cx="100" cy="100" r="40" stroke="#e2e8f0" stroke-width="1" fill="none" />
            <circle cx="100" cy="100" r="60" stroke="#e2e8f0" stroke-width="1" fill="none" />
            <circle cx="100" cy="100" r="80" stroke="#e2e8f0" stroke-width="1" fill="none" />
            
            <!-- Grid Lines -->
            <line x1="100" y1="100" x2="100" y2="20" stroke="#e2e8f0" stroke-width="1" />
            <line x1="100" y1="100" x2="180" y2="100" stroke="#e2e8f0" stroke-width="1" />
            <line x1="100" y1="100" x2="100" y2="180" stroke="#e2e8f0" stroke-width="1" />
            <line x1="100" y1="100" x2="20" y2="100" stroke="#e2e8f0" stroke-width="1" />
            
            <!-- Data Polygon -->
            <polygon points="100,30 170,100 100,160 30,100" fill="#6c5ce7" fill-opacity="0.2" stroke="#6c5ce7" stroke-width="2" />
            
            <!-- Data Points -->
            <circle cx="100" cy="30" r="3" fill="#6c5ce7" />
            <circle cx="170" cy="100" r="3" fill="#6c5ce7" />
            <circle cx="100" cy="160" r="3" fill="#6c5ce7" />
            <circle cx="30" cy="100" r="3" fill="#6c5ce7" />
            
            <!-- Labels -->
            <text x="100" y="15" style="font-size: 8pt; text-anchor: middle; font-weight: bold;">Steady Guardian</text>
            <text x="185" y="100" style="font-size: 8pt; text-anchor: middle; font-weight: bold;">Mindful Architect</text>
            <text x="100" y="195" style="font-size: 8pt; text-anchor: middle; font-weight: bold;">Compassionate Nurturer</text>
            <text x="15" y="100" style="font-size: 8pt; text-anchor: middle; font-weight: bold;">Vibrant Explorer</text>
            
            <!-- Percentage Scale -->
            <text x="150" y="50" style="font-size: 6pt; text-anchor: middle;">50%</text>
            <text x="160" y="40" style="font-size: 6pt; text-anchor: middle;">60%</text>
            <text x="170" y="30" style="font-size: 6pt; text-anchor: middle;">70%</text>
            <text x="180" y="20" style="font-size: 6pt; text-anchor: middle;">80%</text>
          </svg>
          
          <div class="radar-legend">
            <div style="margin-bottom: 5pt;">Compatibility Percentages:</div>
            <div style="display: flex; justify-content: space-around; width: 100%;">
              <span>Steady Guardian: 85%</span>
              <span>Mindful Architect: 80%</span>
              <span>Compassionate Nurturer: 75%</span>
              <span>Vibrant Explorer: 85%</span>
            </div>
          </div>
        </div>
        
        <div class="paragraph">
          Understanding your compatibility patterns can help you recognize potential strengths and challenges in different relationships. Remember that compatibility is just one factor in relationship success - growth, communication, and shared values are equally important.
        </div>
        
        <div class="highlight-box">
          <div class="highlight-text">
            The most fulfilling relationships often involve complementary differences, not just similarities. Look for partners who share your core values but bring different strengths to balance your natural tendencies.
          </div>
        </div>
        
        <!-- Couples CTA -->
        <div class="couples-cta-box">
          <div class="couples-cta-title">Want to compare with your partner?</div>
          <div class="couples-cta-text">
            Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship.
          </div>
        </div>

        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">4</div>
      </div>

      <!-- Page 5: Conversation Starters -->
      <div class="page">
        <div class="section-title">Conversation Starters for Deeper Connection</div>
        <div class="paragraph">
          These questions are designed specifically for your communication style. Use them to create meaningful conversations with potential partners or deepen existing relationships.
        </div>
        
        <div class="conversation-box">
          <div class="conversation-title">Questions to Ask Your Partner</div>
          <div class="conversation-item">"What's a moment from your childhood that still influences how you love?"</div>
          <div class="conversation-item">"If our relationship were a book, what would this chapter be about?"</div>
          <div class="conversation-item">"What's something beautiful you noticed about us this week?"</div>
          <div class="conversation-item">"How do you imagine we'll look back on this time in our lives?"</div>
          <div class="conversation-item">"What's a dream you have for us that you haven't shared yet?"</div>
        </div>
        
        <div class="conversation-box">
          <div class="conversation-title">Questions for Established Relationships</div>
          <div class="conversation-item">"What does emotional safety mean to you in a relationship?"</div>
          <div class="conversation-item">"How do you like to celebrate meaningful moments together?"</div>
          <div class="conversation-item">"What's your favorite way to show love without using words?"</div>
        </div>
        
        <div class="paragraph">
          These questions align with your natural desire for meaningful connection. They invite the kind of depth and authenticity that you value in relationships. Use them when you want to move beyond surface-level conversation into the territory of real connection.
        </div>

        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">5</div>
      </div>

      <!-- Page 6: Action Steps -->
      <div class="page">
        <div class="section-title">Your Action Plan</div>
        <div class="paragraph">
          Putting these insights into action will help you create the meaningful relationships you desire. Here are practical steps you can take:
        </div>

        <div class="subsection-title">This Week: Quick Wins</div>
        <div class="list">
          <div class="list-item">• Share one meaningful story from your past with someone you care about</div>
          <div class="list-item">• Practice expressing a practical need directly</div>
          <div class="list-item">• Notice and appreciate one 'ordinary' moment of connection</div>
          <div class="list-item">• Ask someone a deep conversation starter from this report</div>
        </div>

        <div class="subsection-title">This Month: Building New Patterns</div>
        <div class="list">
          <div class="list-item">• Establish a weekly ritual of connection</div>
          <div class="list-item">• Practice setting one small boundary while maintaining openness</div>
          <div class="list-item">• Reflect on your relationship patterns</div>
          <div class="list-item">• Plan an activity that aligns with your authentic interests</div>
        </div>

        <div class="subsection-title">Long-term: Sustained Growth</div>
        <div class="list">
          <div class="list-item">• Develop consistent emotional self-care practices</div>
          <div class="list-item">• Learn to appreciate practical expressions of love</div>
          <div class="list-item">• Build resilience by reframing challenges as growth opportunities</div>
          <div class="list-item">• Continue exploring compatibility with different personality types</div>
        </div>

        <div class="highlight-box">
          <div class="highlight-text">
            Remember: Your depth and emotional intelligence are gifts. The right person will treasure these qualities, not ask you to diminish them. Trust in your ability to create the meaningful connection you seek.
          </div>
        </div>

        <!-- Final Couples CTA -->
        <div class="couples-cta-box">
          <div class="couples-cta-title">Ready to explore your relationship compatibility?</div>
          <div class="couples-cta-text">
            Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit affinityai.me/couples to get started.
          </div>
        </div>

        <div style="text-align: center; margin-top: 20pt; font-size: 13pt; color: #6c5ce7; font-weight: bold;">
          Thank you for taking this journey of self-discovery. May your love story be everything you dream it can be.
        </div>

        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
        <div class="page-number">6</div>
      </div>
    </body>
    </html>
  `;
};

const handler: Handler = async (event, context) => {
  // Get parameters from query string
  const { name, tagline, compatible, customer } = event.queryStringParameters || {};
  
  if (!name) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Archetype name is required' }),
    };
  }

  try {
    // Generate the HTML content
    const archetypeName = name || 'Romantic Idealist';
    const archetypeTagline = tagline || 'Finding meaning in every connection';
    const compatibleWith = compatible || 'Steady Guardian & Vibrant Explorer';
    const customerName = customer || undefined;
    
    const htmlContent = generateHtmlTemplate(archetypeName, archetypeTagline, compatibleWith, customerName);

    // Launch a browser instance
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    // Create a new page
    const page = await browser.newPage();
    
    // Set the content of the page
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
    });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    // Close the browser
    await browser.close();

    // Return the PDF as a binary response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${archetypeName.toLowerCase().replace(/\s+/g, '-')}-love-blueprint.pdf"`,
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to generate PDF', details: error.message }),
    };
  }
};

export { handler };

