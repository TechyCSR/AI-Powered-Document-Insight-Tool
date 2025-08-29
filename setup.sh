#!/bin/bash

echo "🚀 Setting up AI-Powered Document Insight Tool"

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cp env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
fi

cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating frontend .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please edit frontend/.env.local with your configuration"
fi

cd ..

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure your environment variables:"
echo "   - Edit backend/.env"
echo "   - Edit frontend/.env.local"
echo ""
echo "2. Start the backend (in one terminal):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload"
echo ""
echo "3. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Visit http://localhost:5173"
echo ""
echo "📚 For more details, see README.md"
