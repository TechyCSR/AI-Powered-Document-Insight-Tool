import React from 'react';

// Simple test to see if React renders
function TestComponent() {
  console.log('TestComponent rendering...');
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '20px'
        }}>
          🚀 AI Document Insight Tool
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#6b7280',
          marginBottom: '30px'
        }}>
          React is working! Debug mode active.
        </p>
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'left'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#374151' }}>Status Check:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>✅ React Component Loading</li>
            <li style={{ marginBottom: '8px' }}>✅ JavaScript Executing</li>
            <li style={{ marginBottom: '8px' }}>✅ DOM Rendering</li>
            <li style={{ marginBottom: '8px' }}>🔄 Ready for full app...</li>
          </ul>
        </div>
        <p style={{ 
          marginTop: '20px', 
          fontSize: '14px', 
          color: '#9ca3af' 
        }}>
          Check browser console for any errors
        </p>
      </div>
    </div>
  );
}

function App() {
  console.log('App component rendering...');
  
  // Catch any rendering errors
  try {
    return <TestComponent />;
  } catch (error) {
    console.error('Error rendering App:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error: {String(error)}</h1>
        <p>Check console for details</p>
      </div>
    );
  }
}

export default App;
