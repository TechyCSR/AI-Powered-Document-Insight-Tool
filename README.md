# AI-Powered Document Insight Tool

> **Professional-grade resume analysis platform powered by advanced AI models with intelligent document type detection and comprehensive insight generation.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-summary.techycsr.me-blue?style=for-the-badge)](https://summary.techycsr.me)
[![API Status](https://img.shields.io/badge/🔗_API-summaryapi.techycsr.me-green?style=for-the-badge)](https://summaryapi.techycsr.me/api/v1/health)

## 🎯 **Project Overview**

An enterprise-grade document analysis platform specializing in resume processing with AI-powered insights. The system automatically detects document types and provides structured analysis optimized for professional recruitment and career development workflows.

### **🔑 Key Specializations**
- **Resume Analysis**: Specialized parsing for professional documents with structured output
- **Document Type Detection**: Intelligent classification of uploaded documents
- **Multi-AI Integration**: Dual AI provider setup with intelligent fallback mechanisms
- **Real-time Processing**: Asynchronous document processing with live progress tracking

---

## 🏗️ **System Architecture**

```mermaid
graph TB
    subgraph "Frontend Layer (Vercel)"
        A[React 18 + TypeScript]
        A1[TailwindCSS Styling]
        A2[Clerk Authentication]
        A3[Mobile Detection]
        A4[404 Error Handling]
    end
    
    subgraph "API Gateway (Vercel Serverless)"
        B[FastAPI Backend]
        B1[JWT Validation]
        B2[File Upload Handler]
        B3[Error Management]
        B4[Health Monitoring]
    end
    
    subgraph "Document Processing Engine"
        C[PDFPlumber Extractor]
        C1[Document Type Detector]
        C2[Content Sanitization]
        C3[Text Preprocessing]
    end
    
    subgraph "AI Analysis Layer"
        D[Sarvam AI Primary]
        E[Gemini AI Secondary]
        F[Intelligent Fallback]
        G[Response Structuring]
    end
    
    subgraph "Data Layer"
        H[MongoDB Atlas]
        H1[User Document Store]
        H2[Binary PDF Storage]
        H3[Analysis History]
    end
    
    subgraph "Authentication & Security"
        I[Clerk Identity Provider]
        I1[JWT Token Management]
        I2[User Session Handling]
    end
    
    A -->|HTTPS API Calls| B
    B -->|Document Upload| C
    C -->|Extracted Text| D
    D -->|Fallback on Error| E
    E -->|Final Fallback| F
    D -->|Success Response| G
    E -->|Success Response| G
    F -->|Keyword Analysis| G
    G -->|Structured Data| H
    B -->|Auth Validation| I
    H -->|User Data| B
    B -->|JSON Response| A
```

---

## 🛠️ **Technology Stack**

### **Backend Infrastructure**
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | FastAPI | 0.104.1 | High-performance async API |
| **Language** | Python | 3.12+ | Core backend logic |
| **Database** | MongoDB Atlas | 7.0 | Document storage & history |
| **PDF Processing** | PDFPlumber | 0.9.0 | Text extraction from PDFs |
| **HTTP Client** | httpx | 0.24.0 | Async AI API communications |
| **Authentication** | PyJWT | 2.8.0 | JWT token validation |
| **Deployment** | Vercel Serverless | - | Auto-scaling serverless functions |

### **Frontend Architecture**
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | React | 18.2.0 | Component-based UI framework |
| **Language** | TypeScript | 5.0.2 | Type-safe development |
| **Build Tool** | Vite | 5.0+ | Fast development & bundling |
| **Styling** | TailwindCSS | 3.3.0 | Utility-first CSS framework |
| **Authentication** | Clerk React | 4.29.0 | User authentication SDK |
| **HTTP Client** | Axios | 1.6.0 | API communication |
| **Icons** | Lucide React | 0.263.0 | Consistent iconography |
| **Routing** | React Router | 6.8.0 | Client-side navigation |



---

## 🌐 **Live Deployment**

### **Production URLs**
- **Frontend Application**: [`https://summary.techycsr.me`](https://summary.techycsr.me)
- **Backend API**: [`https://summaryapi.techycsr.me`](https://summaryapi.techycsr.me)
- **Health Endpoint**: [`https://summaryapi.techycsr.me/api/v1/health`](https://summaryapi.techycsr.me/api/v1/health)

### **API Endpoints**

#### **Core Endpoints**
```http
GET    /api/v1/health                     # System health check
POST   /api/v1/upload-resume              # Document upload & analysis
GET    /api/v1/insights                   # User document history
GET    /api/v1/document/{id}/preview      # PDF preview (authenticated)
```

#### **Health Check Response**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-30T13:27:21.331972",
  "environment": "production",
  "database": {
    "connected": true,
    "status": "connected",
    "error": null,
    "insights_count": 42
  }
}
```

#### **Upload Resume Request**
```http
POST /api/v1/upload-resume
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}

file: {pdf_file}
provider: "sarvam" | "gemini"
```

#### **Upload Response (Resume)**
```json
{
  "summary": "**👤 Name:** John Doe\n**📧 Contact:** john.doe@email.com, +1-555-0123\n**💼 Professional Summary:** Experienced software engineer with 5+ years...",
  "provider": "sarvam",
  "is_fallback": false,
  "filename": "resume.pdf",
  "upload_date": "2025-08-30T13:27:21.331972",
  "document_id": "66d1b2c3d4e5f6789abcdef0"
}
```

---

## 🧠 **AI Analysis Features**

### **Resume Analysis Format**
```
👤 Name: [Extracted full name]
📧 Contact: [Phone, Email, Location]
💼 Professional Summary: [Key qualifications highlights]
🎯 Core Skills: [Technical and soft skills]
💪 Experience Highlights:
  • [Most relevant role with quantified achievements]
  • [Second important position with metrics]
  • [Third significant role with impact data]
🎓 Education: [Degrees, institutions, GPA if available]
🏆 Notable Achievements:
  • [Top accomplishment with quantified results]
  • [Second significant achievement]
  • [Third notable accomplishment]
📊 Career Insights:
  • Years of Experience: [Calculated total]
  • Industry Focus: [Primary domain]
  • Career Level: [Entry/Mid/Senior/Executive]
```

### **General Document Analysis Format**
```
📄 Document Type: [Auto-detected type]
📝 Document Summary: [Comprehensive overview]
🔍 Key Insights: [Major findings and observations]
📊 Main Topics: [Primary and secondary topics]
💡 Critical Information: [Important facts and recommendations]
🎯 Target Audience: [Intended readers]
📈 Key Takeaways: [Actionable insights]
```

### **Document Type Detection**
The system automatically detects document types:
- **Resume/CV**: Professional experience documents
- **Research Paper**: Academic and scientific documents
- **Proposal**: Project and business proposals
- **Legal Document**: Contracts and agreements
- **Report**: Analysis and findings documents
- **General Document**: Other document types

---

## 🚀 **Core Functionality**

### **1. Document Upload & Processing**
- **File Validation**: PDF-only, 10MB size limit
- **Text Extraction**: Advanced PDFPlumber integration
- **Content Sanitization**: Clean text preprocessing
- **Progress Tracking**: Real-time upload status

### **2. AI-Powered Analysis**
- **Document Type Detection**: Intelligent classification
- **Dual AI Integration**: Primary (Sarvam) + Secondary (Gemini)
- **Intelligent Fallback**: Keyword frequency analysis
- **Structured Output**: Formatted, actionable insights

### **3. User Management**
- **Secure Authentication**: Clerk-based JWT validation
- **Personal History**: Complete analysis tracking
- **PDF Preview**: Authenticated document viewing
- **Session Management**: Persistent user sessions

### **4. Enterprise Features**
- **Responsive Design**: Mobile detection with desktop optimization
- **Error Handling**: Professional 404 pages and error management
- **Health Monitoring**: System status tracking
- **Performance Optimization**: Async processing and caching

---

## 📱 **User Experience Design**

### **Responsive Behavior**
- **Desktop Optimized**: Full-featured dashboard experience
- **Mobile Detection**: Automatic redirection to mobile-optimized messaging
- **Tablet Support**: Warning banners for limited mobile functionality
- **Progressive Enhancement**: Graceful degradation across devices

### **Interface Highlights**
- **Modern Dashboard**: Clean, professional layout
- **Drag-and-Drop Upload**: Intuitive file handling
- **Real-time Feedback**: Progress indicators and status updates
- **Theme Support**: Dark/light mode toggle
- **Error Recovery**: User-friendly error messages and recovery options

---

## ⚡ **Performance & Scalability**

### **Backend Optimization**
- **Serverless Architecture**: Auto-scaling Vercel functions
- **Async Processing**: Non-blocking I/O operations
- **Connection Pooling**: Optimized MongoDB connections
- **Error Recovery**: Graceful degradation and reconnection logic

### **Frontend Optimization**
- **Code Splitting**: Dynamic imports for reduced bundle size
- **Lazy Loading**: On-demand component loading
- **Caching Strategy**: Optimized API response caching
- **Bundle Analysis**: Size optimization and tree shaking

### **Database Performance**
- **Indexed Queries**: Optimized user-based data retrieval
- **Document Storage**: Efficient binary PDF storage
- **Connection Management**: Serverless-optimized pooling

---

## 🔒 **Security Implementation**

### **Authentication & Authorization**
- **JWT Validation**: Secure token-based authentication
- **User Isolation**: Strict data access controls
- **Session Management**: Secure session handling
- **API Protection**: Authenticated endpoint access

### **Data Security**
- **File Validation**: Strict PDF-only upload enforcement
- **Size Limits**: 10MB maximum file size
- **Content Sanitization**: Safe text processing
- **Secure Storage**: Encrypted MongoDB Atlas storage

### **Infrastructure Security**
- **HTTPS Enforcement**: SSL/TLS encryption
- **Environment Variables**: Secure configuration management
- **API Rate Limiting**: Protection against abuse
- **Error Handling**: Secure error message disclosure

---

## 📊 **System Status**

```
✅ Backend API: Operational (99.9% uptime)
✅ Frontend App: Deployed & Responsive
✅ Database: MongoDB Atlas Connected (42 documents)
✅ AI Services: Sarvam + Gemini Operational
✅ Authentication: Clerk Integration Active
✅ File Processing: PDF Upload & Analysis Working
✅ Mobile Support: Detection & Redirection Active
✅ Error Handling: 404 Pages & Recovery Implemented
```

---

## 🎯 **Project Highlights**

- **Production-Ready**: Fully deployed and operational system
- **Enterprise-Grade**: Professional UI/UX with comprehensive error handling
- **AI-Specialized**: Optimized for resume analysis with fallback intelligence
- **Scalable Architecture**: Serverless deployment with auto-scaling capabilities
- **Modern Tech Stack**: Latest frameworks and best practices implementation
- **Security-First**: Comprehensive authentication and data protection
- **Performance-Optimized**: Fast loading times and efficient processing

---

*Built with modern web technologies for professional document analysis workflows. Deployed and operational at [summary.techycsr.me](https://summary.techycsr.me)*
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


**Built with ❤️ using modern full-stack technologies**
