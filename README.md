# 🎨 AI Research Copilot - Frontend

A **modern React-based frontend** that provides a seamless interface for AI-powered research paper analysis. Built with **Vite**, **Tailwind CSS**, and **React Router** for optimal performance and user experience.

## 🌟 Features Overview

### 📄 **Smart Document Management**
- **Drag & Drop Upload**: Intuitive PDF upload with instant processing feedback
- **Real-time Processing**: Live updates during document analysis
- **File History**: Track all uploaded documents with metadata

### 🤖 **Integrated AI Capabilities**
- **Instant Summaries**: View AI-generated summaries immediately after upload
- **In-line Translation**: Translate summaries to 11+ languages without leaving the page
- **Interactive Q&A**: Chat-style interface for document questions
- **Source References**: View relevant document sections for each answer

### 🎯 **User Experience**
- **Single-Page Workflow**: No separate pages for translation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Modern, eye-friendly interface
- **Loading States**: Clear feedback for all operations

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Upload Page   │───▶│  Analyze Page   │───▶│   Q&A Chat     │
│   (File Mgmt)   │    │ (Summary+Trans) │    │  (Interactive)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend API Integration                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Upload    │  │  Summarize  │  │  Translate  │  ┌─────────┐│
│  │     API     │  │     API     │  │     API     │  │   Q&A   ││
│  └─────────────┘  └─────────────┘  └─────────────┘  │   API   ││
└─────────────────────────────────────────────────────┴─────────┘
```

---

## 🚀 Quick Start

### 1️⃣ **Installation**
```powershell
# Clone the repository
git clone https://github.com/A-ryanVAT-S/AI-Research-Copilot-Frontend.git
cd AI-Research-Copilot-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2️⃣ **Environment Setup**
```powershell
# Create .env file (optional)
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

### 3️⃣ **Access Application**
- **Development**: http://localhost:5173
- **Production Build**: `npm run build && npm run preview`

---

## 📱 Page Structure

### **Upload Page** (`/`)
- **File Upload Interface**: Drag & drop or click to upload
- **Processing Feedback**: Real-time status during document processing
- **Document Library**: View all uploaded papers with quick actions
- **Action Buttons**: Direct access to Analyze & Q/A features

### **Analyze Page** (`/analyze/:id`)
- **Document Summary**: AI-generated research paper summary
- **Translation Widget**: Dropdown to translate summary inline
- **Language Support**: 11 languages (Spanish, French, German, etc.)
- **Toggle View**: Switch between original and translated content

### **Q&A Chat** (`/qa/:id`)
- **Chat Interface**: WhatsApp-style conversation layout
- **Question Input**: Type questions about the document
- **AI Responses**: Detailed answers with source references
- **Message History**: Persistent conversation within session

---

## 🛠️ Technical Stack

### **Core Technologies**
- **React 19**: Latest React with concurrent features
- **Vite 6**: Lightning-fast build tool and dev server
- **Tailwind CSS 4**: Utility-first styling framework
- **React Router 7**: Client-side routing and navigation

### **Key Libraries**
```json
{
  "axios": "^1.9.0",           // HTTP client for API calls
  "react-icons": "^5.5.0",     // Icon library (FontAwesome)
  "react-router-dom": "^7.4.0" // Routing and navigation
}
```

### **Development Tools**
- **ESLint**: Code linting and formatting
- **Vite HMR**: Hot module replacement for development
- **PostCSS**: CSS processing and optimization

---

## 📂 Project Structure

```
AI-Research-Copilot-Frontend/
├── public/
│   └── vite.svg              # Favicon and static assets
├── src/
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # Application entry point
│   ├── index.css             # Global styles (Tailwind imports)
│   └── pages/
│       ├── upload.jsx        # File upload and management
│       ├── analyze.jsx       # Summary display with translation
│       └── qachat.jsx        # Interactive Q&A interface
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint rules and settings
└── README.md                 # This documentation
```

---

## 🎨 UI/UX Features

### **Design System**
- **Color Palette**: Dark theme with blue accents
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Icons**: FontAwesome icons for intuitive navigation

### **Interactive Elements**
- **Hover States**: Visual feedback on all clickable elements
- **Loading Animations**: Spinners and progress indicators
- **Error Handling**: User-friendly error messages
- **Responsive Layout**: Adapts to all screen sizes

### **Accessibility**
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Semantic HTML and ARIA labels
- **Color Contrast**: WCAG 2.1 AA compliance
- **Focus Indicators**: Clear focus states for all inputs

---

## 🔧 Configuration & Customization

### **Environment Variables**
```bash
# .env file (optional)
VITE_API_BASE_URL=http://localhost:8000  # Backend API URL
VITE_APP_TITLE=AI Research Copilot       # Application title
```

### **Tailwind Customization**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // Tailwind CSS plugin
  ]
})
```

### **API Configuration**
All API calls are centralized and use:
- **Base URL**: Configurable via environment variables
- **Error Handling**: Centralized error processing
- **Loading States**: Consistent loading indicators
- **CORS**: Properly configured for cross-origin requests

---

## 📊 Performance Optimizations

### **Bundle Optimization**
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Optimized images and fonts
- **Gzip Compression**: Enabled for production builds

### **Runtime Performance**
- **React 19 Features**: Concurrent rendering
- **Lazy Loading**: Components loaded on demand
- **Memory Management**: Proper cleanup in useEffect
- **API Caching**: Avoid redundant API calls

---

## 🚀 Deployment

### **Development**
```powershell
npm run dev          # Start development server
npm run lint         # Run ESLint checks
```

### **Production**
```powershell
npm run build        # Create production build
npm run preview      # Preview production build locally
```

### **Build Output**
- **Static Files**: Generated in `dist/` directory
- **Assets**: Optimized CSS, JS, and image files
- **Deployment**: Can be deployed to any static hosting service

---

## 🔄 Integration with Backend

### **API Endpoints Used**
- `POST /api/upload` - File upload with processing
- `GET /api/analyze/{id}` - Fetch document summary
- `POST /api/translate/{id}` - Translate summary
- `POST /api/qa/{id}` - Ask questions about document
- `GET /api/file-info/{id}` - Get document metadata

### **Data Flow**
1. **Upload**: File sent to backend, returns document ID
2. **Analysis**: Fetch pre-generated summary from backend
3. **Translation**: Send target language, receive translated summary
4. **Q&A**: Send questions, receive answers with sources

---

## 🛡️ Error Handling & Security

### **Error Management**
- **API Errors**: Graceful handling with user-friendly messages
- **Network Issues**: Retry logic and offline detection
- **File Validation**: Client-side file type and size checks
- **Form Validation**: Input validation before API calls

### **Security Features**
- **XSS Prevention**: Sanitized user inputs
- **CSRF Protection**: Proper token handling
- **File Upload**: Restricted to PDF files only
- **Content Security**: No inline scripts or styles

---

## 🔮 Future Enhancements
- [ ] **Real-time Updates**: WebSocket integration for live processing
- [ ] **User Authentication**: Login and user session management
- [ ] **Document Collaboration**: Share documents with other users
- [ ] **Advanced Search**: Full-text search across documents
- [ ] **Export Features**: Download summaries and Q&A sessions
- [ ] **Mobile App**: React Native version for mobile devices

---

## 📞 Support & Contributing

**GitHub**: Submit issues and feature requests  
**Development**: Fork and submit pull requests  
**Documentation**: Help improve this README  

**Tech Stack**: React 19, Vite 6, Tailwind CSS 4, React Router 7
