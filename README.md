# Affinity AI - Romantic Archetype Quiz

A beautiful, production-ready React application that helps users discover their romantic archetype through an interactive quiz experience.

## 🚀 Features

- **Interactive Quiz**: 15-question assessment with multiple question types
- **Beautiful UI**: Modern design with Tailwind CSS and Framer Motion animations
- **Romantic Archetypes**: 5 unique personality types with detailed descriptions
- **Premium Reports**: Comprehensive PDF reports with personalized insights
- **Stripe Integration**: Secure payment processing for premium features
- **Supabase Backend**: Database storage for user data and purchases
- **Responsive Design**: Works perfectly on all devices

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **PDF Generation**: React-PDF
- **Deployment**: Netlify
- **Functions**: Netlify Functions

## 📋 Prerequisites

- Node.js 20.19.1 or higher
- npm or yarn
- Supabase account and project
- Stripe account (for payments)
- Netlify account (for deployment)

## 🔧 Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd affinity-ai
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Optional: OpenAI for enhanced quiz analysis
OPENAI_API_KEY=your_openai_api_key
```

### 3. Database Setup

#### Option A: Automatic Setup (Recommended)
1. Start the development server: `npm run dev`
2. Navigate to `/database-test`
3. Click "Setup Database Tables" and follow the instructions

#### Option B: Manual Setup
1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250607091526_patient_wildflower.sql`
4. Execute the SQL to create tables and functions

### 4. Stripe Configuration
1. Create products in your Stripe dashboard
2. Update `src/stripe-config.ts` with your price IDs
3. Set up webhook endpoints in Stripe dashboard:
   - `https://your-domain.netlify.app/.netlify/functions/stripe-webhook`

### 5. Development
```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Header, Footer, Layout
│   ├── quiz/           # Quiz-specific components
│   ├── share/          # Social sharing components
│   └── ui/             # Basic UI components
├── data/               # Static data (questions, archetypes)
├── lib/                # Utility functions and API clients
├── pages/              # Page components
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── utils/              # Helper functions

netlify/functions/      # Serverless functions
├── create-checkout-session.ts
├── fetch-session.ts
├── get-session-data.ts
└── stripe-webhook.ts

supabase/migrations/    # Database migrations
```

## 🎯 Key Features Explained

### Quiz System
- **Multiple Question Types**: Multiple choice, Likert scale, and free text
- **Progress Tracking**: Visual progress bar and question numbering
- **State Management**: Persistent quiz state with Zustand
- **Result Calculation**: Algorithm-based archetype matching

### Archetype System
- **5 Unique Types**: Narrative Idealist, Steady Guardian, Vibrant Explorer, Mindful Architect, Compassionate Nurturer
- **Compatibility Matching**: Shows compatible archetypes for each type
- **Detailed Descriptions**: Rich personality insights and characteristics

### Premium Features
- **PDF Reports**: 10-15 page personalized reports using React-PDF
- **Stripe Integration**: Secure payment processing
- **Database Storage**: Purchase tracking and user data management
- **Email Receipts**: Automatic receipt generation

### Payment Flow
1. User completes quiz → gets basic results
2. Option to purchase premium report
3. Stripe checkout → payment processing
4. Webhook confirms payment → updates database
5. User redirected to premium report page
6. PDF download and additional insights available

## 🔒 Security Features

- **Row Level Security**: Supabase RLS policies protect user data
- **Environment Variables**: Sensitive keys stored securely
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: Form validation and sanitization
- **Webhook Verification**: Stripe webhook signature verification

## 🚀 Deployment

### Netlify Deployment
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy with build command: `npm run build`
4. Set up custom domain (optional)

### Environment Variables for Production
Ensure all environment variables are set in your Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🧪 Testing

### Test the Application
1. **Quiz Flow**: Complete the full quiz experience
2. **Payment Flow**: Use Stripe test cards (4242424242424242)
3. **Database**: Verify data storage in Supabase
4. **PDF Generation**: Test report downloads
5. **Responsive Design**: Test on various screen sizes

### Test Cards (Stripe)
- **Success**: 4242424242424242
- **Declined**: 4000000000000002
- **Insufficient Funds**: 4000000000009995

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed
- Verify Supabase URL and anon key
- Check if tables exist (run migrations)
- Verify RLS policies are set correctly

#### Stripe Payment Issues
- Confirm webhook endpoint is configured
- Check webhook secret matches environment variable
- Verify price IDs in stripe-config.ts

#### PDF Generation Problems
- Ensure React-PDF dependencies are installed
- Check for font loading issues
- Verify PDF component structure

#### 404 Errors
- Check React Router configuration
- Verify all routes are properly defined
- Ensure build process includes all files

### Debug Mode
Enable detailed logging by checking browser console for:
- `[SUPABASE]` - Database operations
- `[STRIPE]` - Payment processing
- `[QUIZ]` - Quiz state management
- `[PDF]` - Report generation

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [React-PDF Documentation](https://react-pdf.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Verify all environment variables are set correctly
4. Test database and Stripe connections using `/database-test`

For additional support, please contact:
- Technical Support: support@affinityai.me
- Sales Inquiries: sales@affinityai.me