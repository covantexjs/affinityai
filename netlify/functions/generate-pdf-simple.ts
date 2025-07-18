import { Handler } from '@netlify/functions';

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
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .page {
          page-break-after: always;
          margin-bottom: 30px;
        }
        h1 {
          color: #6c5ce7;
          text-align: center;
          font-size: 24px;
        }
        h2 {
          color: #6c5ce7;
          font-size: 20px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        h3 {
          color: #333;
          font-size: 18px;
        }
        p {
          line-height: 1.6;
        }
        .highlight {
          background-color: #f0e6ff;
          padding: 15px;
          border-left: 4px solid #6c5ce7;
          margin: 20px 0;
        }
        .couples-cta {
          background-color: #f0e6ff;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .couples-cta h3 {
          color: #6c5ce7;
          margin-top: 0;
        }
        .compatibility {
          background-color: #f0fff4;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .compatibility h3 {
          color: #38a169;
          margin-top: 0;
        }
        .radar {
          text-align: center;
          margin: 30px 0;
          padding: 20px;
          background-color: #f8f9ff;
          border-radius: 5px;
        }
        .radar-description {
          text-align: center;
          font-style: italic;
          margin-top: 10px;
        }
        ul {
          margin-left: 20px;
        }
        li {
          margin-bottom: 10px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <!-- Page 1: Cover -->
      <div class="page">
        <h1 style="font-size: 36px; margin-top: 100px;">Love Blueprint</h1>
        <h2 style="text-align: center; border: none;">Your AI-Enhanced Relationship Profile</h2>
        <h1 style="color: #fd79a8; font-size: 30px; margin-top: 50px;">${archetypeName}</h1>
        <p style="text-align: center; font-style: italic; color: #6c5ce7; font-size: 18px;">"${archetypeTagline}"</p>
        ${customerName ? `<p style="text-align: center; margin-top: 100px;">Prepared for ${customerName}</p>` : ''}
        <p style="text-align: center; color: #999;">${currentDate}</p>
      </div>

      <!-- Page 2: Overview -->
      <div class="page">
        <h2>Your Unique Love Profile</h2>
        <p>
          As a ${archetypeName}, you bring a unique perspective to relationships that combines emotional depth, authenticity, and meaningful connection. 
          Your approach to love is deeply personal and meaningful.
        </p>
        
        <div class="highlight">
          <p>
            As a ${archetypeName}, you don't just experience love—you create meaningful connections that become the foundation of your personal story and identity. Your approach to relationships is both deeply personal and universally resonant.
          </p>
        </div>

        <h2>Your Relationship Strengths</h2>
        <p>
          These key strengths define how you show up in relationships and what makes you a valuable partner:
        </p>
        <ul>
          <li>Deep emotional intelligence and empathy</li>
          <li>Ability to create meaningful connections</li>
          <li>Strong commitment to authentic relationships</li>
          <li>Natural storytelling ability that enriches relationships</li>
          <li>Capacity for profound emotional intimacy</li>
        </ul>

        <h2>Compatibility Overview</h2>
        <div class="compatibility">
          <h3>Your Perfect Match</h3>
          <p>
            You naturally connect well with: ${compatibleWith}
          </p>
          <p>
            In real-world terms, you'll likely click with people who are spontaneous and adventurous (Vibrant Explorer types) or those who provide stability and reliability (Steady Guardian types). These personalities balance your thoughtful, meaning-focused approach with either exciting new experiences or grounding practicality.
          </p>
        </div>
        
        <!-- Couples CTA - Added to Page 2 -->
        <div class="couples-cta">
          <h3>Want to compare this with your partner's archetype?</h3>
          <p>
            Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit affinityai.me/couples to get started.
          </p>
        </div>

        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
      </div>

      <!-- Page 3: Communication -->
      <div class="page">
        <h2>Your Communication Style</h2>
        <p>
          As a ${archetypeName}, your way of talking and listening is unique. You naturally go beyond small talk to create meaningful conversations that build real connection.
        </p>
        
        <h3>Your Communication Superpowers</h3>
        <ul>
          <li>Expressing emotions with clarity and authenticity</li>
          <li>Active listening with genuine empathy</li>
          <li>Creating safe spaces for vulnerable conversations</li>
          <li>Understanding emotional subtext and nuance</li>
        </ul>
        
        <h3>Communication Blind Spots</h3>
        <ul>
          <li>Being direct about practical needs</li>
          <li>Discussing mundane topics without losing interest</li>
          <li>Addressing conflicts before they escalate</li>
        </ul>

        <div class="highlight">
          <p>
            Pro Tip: Your depth of communication is a gift. When you need something practical (like deciding where to eat or setting a schedule), try being direct and specific rather than hoping your partner will sense what you need. Save the poetic language for the emotional moments where it truly shines.
          </p>
        </div>

        <h2>Your Conflict Style</h2>
        <p>
          When disagreements happen, you tend to focus on feelings first. Instead of jumping to solutions, you want to make sure everyone feels heard and understood.
        </p>
        
        <p>
          This approach has real benefits - it creates emotional safety and deeper understanding. But sometimes it can leave practical problems unsolved or drag conflicts out longer than necessary.
        </p>
        
        <div class="highlight">
          <p>
            Try This: When conflicts arise, start by saying "I hear you and I understand how you feel" to create emotional safety. Then add "Let's figure out a solution together" to move toward resolution. This two-step approach honors both emotional needs and practical problem-solving.
          </p>
        </div>

        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
      </div>

      <!-- Page 4: Compatibility Radar -->
      <div class="page">
        <h2>Your Compatibility Radar</h2>
        <p>
          This visualization shows your natural compatibility with different relationship archetypes. The further the point extends outward on each axis, the stronger the compatibility.
        </p>
        
        <!-- Compatibility Radar Chart (Text Version) -->
        <div class="radar">
          <h3>Compatibility Percentages:</h3>
          <p>Steady Guardian: 85%</p>
          <p>Mindful Architect: 80%</p>
          <p>Compassionate Nurturer: 75%</p>
          <p>Vibrant Explorer: 85%</p>
          
          <p class="radar-description">
            The radar visualization would show your strongest connections with Steady Guardian and Vibrant Explorer archetypes, with slightly lower but still strong compatibility with Mindful Architect and Compassionate Nurturer archetypes.
          </p>
        </div>
        
        <p>
          Understanding your compatibility patterns can help you recognize potential strengths and challenges in different relationships. Remember that compatibility is just one factor in relationship success - growth, communication, and shared values are equally important.
        </p>
        
        <div class="highlight">
          <p>
            The most fulfilling relationships often involve complementary differences, not just similarities. Look for partners who share your core values but bring different strengths to balance your natural tendencies.
          </p>
        </div>
        
        <!-- Couples CTA -->
        <div class="couples-cta">
          <h3>Want to compare with your partner?</h3>
          <p>
            Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship.
          </p>
        </div>

        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
      </div>

      <!-- Page 5: Conversation Starters -->
      <div class="page">
        <h2>Conversation Starters for Deeper Connection</h2>
        <p>
          These questions are designed specifically for your communication style. Use them to create meaningful conversations with potential partners or deepen existing relationships.
        </p>
        
        <h3>Questions to Ask Your Partner</h3>
        <ul>
          <li>"What's a moment from your childhood that still influences how you love?"</li>
          <li>"If our relationship were a book, what would this chapter be about?"</li>
          <li>"What's something beautiful you noticed about us this week?"</li>
          <li>"How do you imagine we'll look back on this time in our lives?"</li>
          <li>"What's a dream you have for us that you haven't shared yet?"</li>
        </ul>
        
        <h3>Questions for Established Relationships</h3>
        <ul>
          <li>"What does emotional safety mean to you in a relationship?"</li>
          <li>"How do you like to celebrate meaningful moments together?"</li>
          <li>"What's your favorite way to show love without using words?"</li>
        </ul>
        
        <p>
          These questions align with your natural desire for meaningful connection. They invite the kind of depth and authenticity that you value in relationships. Use them when you want to move beyond surface-level conversation into the territory of real connection.
        </p>

        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
      </div>

      <!-- Page 6: Action Steps -->
      <div class="page">
        <h2>Your Action Plan</h2>
        <p>
          Putting these insights into action will help you create the meaningful relationships you desire. Here are practical steps you can take:
        </p>

        <h3>This Week: Quick Wins</h3>
        <ul>
          <li>Share one meaningful story from your past with someone you care about</li>
          <li>Practice expressing a practical need directly</li>
          <li>Notice and appreciate one 'ordinary' moment of connection</li>
          <li>Ask someone a deep conversation starter from this report</li>
        </ul>

        <h3>This Month: Building New Patterns</h3>
        <ul>
          <li>Establish a weekly ritual of connection</li>
          <li>Practice setting one small boundary while maintaining openness</li>
          <li>Reflect on your relationship patterns</li>
          <li>Plan an activity that aligns with your authentic interests</li>
        </ul>

        <h3>Long-term: Sustained Growth</h3>
        <ul>
          <li>Develop consistent emotional self-care practices</li>
          <li>Learn to appreciate practical expressions of love</li>
          <li>Build resilience by reframing challenges as growth opportunities</li>
          <li>Continue exploring compatibility with different personality types</li>
        </ul>

        <div class="highlight">
          <p>
            Remember: Your depth and emotional intelligence are gifts. The right person will treasure these qualities, not ask you to diminish them. Trust in your ability to create the meaningful connection you seek.
          </p>
        </div>

        <!-- Final Couples CTA -->
        <div class="couples-cta">
          <h3>Ready to explore your relationship compatibility?</h3>
          <p>
            Try Couples Mode to discover how your archetypes interact and get personalized insights for your relationship. Visit affinityai.me/couples to get started.
          </p>
        </div>

        <p style="text-align: center; margin-top: 30px; font-size: 16px; color: #6c5ce7; font-weight: bold;">
          Thank you for taking this journey of self-discovery. May your love story be everything you dream it can be.
        </p>

        <div class="footer">Generated by Affinity AI - Your guide to deeper connections</div>
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

    // Return the HTML directly instead of generating a PDF
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: htmlContent,
    };
  } catch (error) {
    console.error('Error generating HTML:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to generate HTML', details: error.message }),
    };
  }
};

export { handler };

