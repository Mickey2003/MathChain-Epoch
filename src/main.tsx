import React from 'react'
import ReactDOM from 'react-dom/client'

console.log('Main.tsx loaded');

// 简单的内联组件
const SimpleApp = () => {
  console.log('SimpleApp component rendering');
  return React.createElement('div', {
    style: {
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1e40af',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }
  }, [
    React.createElement('h1', { key: 'title', style: { fontSize: '48px', marginBottom: '20px' } }, 'MathChain Epoch'),
    React.createElement('h2', { key: 'subtitle', style: { fontSize: '24px', marginBottom: '20px' } }, '数链纪元'),
    React.createElement('p', { key: 'message', style: { fontSize: '18px' } }, '页面加载成功！🎉'),
    React.createElement('button', {
      key: 'button',
      style: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '20px'
      },
      onClick: () => {
        alert('React应用正常工作！');
        console.log('Button clicked successfully');
      }
    }, '测试按钮')
  ]);
};

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  console.log('React root created');

  root.render(React.createElement(SimpleApp));
  console.log('App rendered');
} else {
  console.error('Root element not found!');
}
