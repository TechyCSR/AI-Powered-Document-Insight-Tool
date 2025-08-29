# 🚀 AI-Powered Document Insight Tool

A modern full-stack web application that allows users to upload resumes (PDFs), process them with AI summarizers, and view their personalized history of uploads. Built with **Sarvam AI as the default summarizer** with **Gemini provider** as an alternative, featuring intelligent fallback mechanisms.

![Project Banner](https://img.shields.io/badge/Status-Production%20Ready-green) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-blue) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue)

## 🎯 Features

### ✨ Core Functionality
- **PDF Upload & Processing** - Drag-and-drop interface for seamless PDF uploads
- **Multi-AI Provider Support** - Choose between Sarvam AI (default) and Gemini AI
- **Intelligent Fallback** - Frequency-based keyword extraction when AI APIs fail
- **User Authentication** - Secure Clerk-based authentication with Google/email options
- **Personal History** - Track and manage all document analyses
- **Real-time Processing** - Live progress tracking during document analysis

### 🔐 Security & Authentication
- JWT-based authentication via Clerk
- Secure file upload validation (10MB limit, PDF-only)
- User-isolated data storage
- Protected API endpoints

### 🎨 Modern UI/UX
- Responsive design with TailwindCSS
- Smooth animations and transitions
- Professional dashboard interface
- Mobile-first approach
- Dark/light theme support

## 🏗️ Architecture

```mermaid
graph TB
    A[User Browser] -->|HTTPS| B[React Frontend]
    B -->|API Calls| C[FastAPI Backend]
    C -->|JWT Validation| D[Clerk Auth]
    C -->|PDF Processing| E[PDFPlumber]
    C -->|AI Analysis| F[Sarvam AI]
    C -->|Fallback AI| G[Gemini AI]
    C -->|Data Storage| H[MongoDB Atlas]
    C -->|Fallback Logic| I[Frequency Analysis]
    
    subgraph "Frontend (Vercel)"
        B
        J[TailwindCSS]
        K[React Router]
        L[Lucide Icons]
    end
    
    subgraph "Backend (Vercel Serverless)"
        C
        M[Async FastAPI]
        N[Motor MongoDB Driver]
        O[File Validation]
    end
    
    subgraph "External Services"
        D
        F
        G
        H
    end
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: Clerk JWT validation
- **PDF Processing**: PDFPlumber
- **AI Providers**: Sarvam AI (primary), Gemini AI (secondary)
- **Deployment**: Vercel Serverless

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Authentication**: Clerk React SDK
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Deployment**: Vercel

### AI Integration
- **Primary**: Sarvam AI (for assignment adherence)
- **Secondary**: Gemini AI (alternative option)
- **Fallback**: Frequency-based keyword extraction

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- MongoDB Atlas account
- Clerk account
- Sarvam AI API key (optional)
- Gemini AI API key (optional)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-Powered-Document-Insight-Tool
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp env.example .env
# Edit .env with your configuration
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp env.example .env.local
# Edit .env.local with your configuration
```

### 4. Environment Configuration

#### Backend (.env)
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/document_insights?retryWrites=true&w=majority

# Clerk Configuration
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# AI API Keys
SARVAM_API_KEY=your_sarvam_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Application Settings
ENVIRONMENT=development
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Frontend (.env.local)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 5. Run the Application

#### Start Backend (Terminal 1)
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 📚 API Documentation

### Endpoints

#### Authentication
All endpoints except `/health` require authentication via Clerk JWT tokens.

#### File Upload
```http
POST /api/v1/upload-resume
Content-Type: multipart/form-data
Authorization: Bearer {clerk_jwt_token}

Parameters:
- file: PDF file (max 10MB)
- provider: 'sarvam' | 'gemini'
```

#### Get User Insights
```http
GET /api/v1/insights
Authorization: Bearer {clerk_jwt_token}
```

#### Health Check
```http
GET /api/v1/health
```

### Response Formats

#### Upload Response
```json
{
  "success": true,
  "message": "Resume processed successfully",
  "summary": "Candidate has strong Python and React experience...",
  "provider": "sarvam",
  "is_fallback": false,
  "filename": "resume.pdf",
  "upload_date": "2025-08-28T14:00:00Z"
}
```

#### Insights Response
```json
{
  "success": true,
  "insights": [
    {
      "user_id": "clerk_12345",
      "filename": "resume.pdf",
      "upload_date": "2025-08-28T14:00:00Z",
      "provider": "sarvam",
      "summary": "Professional summary...",
      "is_fallback": false,
      "file_size": 1234567
    }
  ],
  "total_count": 1
}
```

## 🚀 Deployment

### Prerequisites for Deployment
1. **Vercel Account** - For hosting both frontend and backend
2. **MongoDB Atlas** - Cloud database
3. **Clerk Account** - Authentication service
4. **Domain** (optional) - For custom domain

### Backend Deployment (Vercel)

1. **Connect to Vercel**
```bash
cd backend
npm i -g vercel  # Install Vercel CLI
vercel  # Follow the prompts
```

2. **Set Environment Variables**
Go to your Vercel dashboard and add:
- `MONGODB_URI`
- `CLERK_SECRET_KEY`
- `SARVAM_API_KEY`
- `GEMINI_API_KEY`
- `ENVIRONMENT=production`
- `DEBUG=False`
- `ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app`

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
```bash
cd frontend
vercel  # Follow the prompts
```

2. **Set Environment Variables**
Add to Vercel dashboard:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL=https://your-backend-domain.vercel.app/api/v1`

### Post-Deployment Configuration

1. **Update Clerk Settings**
   - Add your production domains to allowed origins
   - Update redirect URLs

2. **Update API CORS**
   - Add production frontend URL to backend CORS settings

3. **Test the Deployment**
   - Verify authentication flow
   - Test file upload functionality
   - Check AI provider integration

## 🔧 Development

### Project Structure
```
AI-Powered-Document-Insight-Tool/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── routes.py       # API endpoints
│   │   ├── auth.py         # Clerk authentication
│   │   ├── database.py     # MongoDB connection
│   │   ├── models.py       # Pydantic models
│   │   ├── ai_providers.py # AI integration
│   │   ├── pdf_processor.py# PDF text extraction
│   │   └── config.py       # Configuration
│   ├── requirements.txt    # Python dependencies
│   └── vercel.json        # Vercel config
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities and API
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   ├── package.json       # Node dependencies
│   └── vercel.json       # Vercel config
└── README.md             # This file
```

### Key Components

#### Backend Services
- **PDFProcessor**: Extracts text from PDF files using PDFPlumber
- **AIProviderService**: Manages Sarvam AI, Gemini AI, and fallback logic
- **Database**: MongoDB operations with Motor async driver
- **Auth**: Clerk JWT validation middleware

#### Frontend Components
- **Dashboard**: Main application interface
- **UploadSection**: File upload with drag-and-drop
- **InsightsDisplay**: AI analysis results viewer
- **HistoryTab**: Document history management
- **LandingPage**: Marketing/welcome page

### Adding New AI Providers

1. **Update Models**
```python
# backend/app/models.py
class AIProvider(str, Enum):
    SARVAM = "sarvam"
    GEMINI = "gemini"
    NEW_PROVIDER = "new_provider"  # Add here
```

2. **Implement Provider**
```python
# backend/app/ai_providers.py
@staticmethod
async def _get_new_provider_summary(text: str) -> str:
    # Implementation here
    pass
```

3. **Update Frontend**
```typescript
// frontend/src/types/index.ts
export type AIProvider = 'sarvam' | 'gemini' | 'new_provider';
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest  # Run tests (add test files as needed)
```

### Frontend Testing
```bash
cd frontend
npm test  # Run Jest tests (add test files as needed)
```

### Manual Testing Checklist
- [ ] User registration/login
- [ ] PDF upload (valid/invalid files)
- [ ] AI provider selection
- [ ] Summary generation
- [ ] Fallback mechanism
- [ ] History viewing
- [ ] Responsive design
- [ ] Error handling

## 🔍 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
- Verify MongoDB URI in environment variables
- Check IP whitelist in MongoDB Atlas
- Ensure proper network connectivity

#### 2. Clerk Authentication Errors
- Verify Clerk keys are correctly set
- Check allowed origins in Clerk dashboard
- Ensure JWT token is being passed correctly

#### 3. AI Provider Failures
- Check API keys are valid and have credits
- Verify rate limiting isn't being hit
- Confirm correct API endpoints are being used

#### 4. File Upload Issues
- Check file size limits (10MB default)
- Verify CORS settings for file uploads
- Ensure proper Content-Type headers

#### 5. Build/Deployment Errors
- Verify all environment variables are set
- Check Node.js/Python versions
- Ensure all dependencies are installed

### Debug Mode
Enable debug logging:
```env
DEBUG=True  # Backend
VITE_DEBUG=true  # Frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript/Python type hints
- Add proper error handling
- Include appropriate logging
- Write descriptive commit messages
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Sarvam AI** - Primary AI analysis provider
- **Google Gemini** - Secondary AI analysis provider
- **Clerk** - Authentication platform
- **MongoDB Atlas** - Cloud database service
- **Vercel** - Deployment platform
- **FastAPI** - High-performance Python web framework
- **React** - Frontend user interface library

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

---

**Built with ❤️ using modern full-stack technologies**
