import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.test.tsx'

console.log('🚀 Main.tsx loaded');
console.log('📦 React version:', React.version);

const rootElement = document.getElementById('root');
console.log('🎯 Root element found:', !!rootElement);

if (rootElement) {
  console.log('🔧 Creating React root...');
  const root = ReactDOM.createRoot(rootElement);

  console.log('🎨 Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ App rendered successfully!');
} else {
  console.error('❌ Root element not found!');
  // 创建一个备用的根元素
  const fallbackRoot = document.createElement('div');
  fallbackRoot.id = 'fallback-root';
  fallbackRoot.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #dc2626;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, sans-serif;
    z-index: 9999;
  `;
  fallbackRoot.innerHTML = '<h1>❌ 根元素未找到！请检查HTML文件。</h1>';
  document.body.appendChild(fallbackRoot);
}
