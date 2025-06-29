import React from 'react';

const App: React.FC = () => {
  console.log('App.test.tsx component rendering');
  
  const handleClick = () => {
    alert('React应用正常工作！🎉');
    console.log('Button clicked - React is working!');
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      backgroundColor: '#1e40af',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '48px',
        marginBottom: '20px',
        background: 'linear-gradient(45deg, #60a5fa, #a78bfa, #f472b6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        MathChain Epoch
      </h1>
      
      <h2 style={{
        fontSize: '24px',
        marginBottom: '20px',
        color: '#bfdbfe'
      }}>
        数链纪元
      </h2>
      
      <p style={{
        fontSize: '18px',
        marginBottom: '30px',
        color: '#dbeafe'
      }}>
        ✅ React应用加载成功！
      </p>
      
      <div style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '30px'
      }}>
        <button 
          onClick={handleClick}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          🎮 测试React
        </button>
        
        <button 
          onClick={() => {
            console.log('Console test button clicked');
            const now = new Date().toLocaleString();
            alert(`当前时间: ${now}\n\nReact状态: ✅ 正常\nNode.js: v22.16.0\nVite: v5.4.19`);
          }}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📊 系统信息
        </button>
      </div>
      
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '12px',
        maxWidth: '600px',
        margin: '0 20px'
      }}>
        <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>🎯 测试状态</h3>
        <div style={{ textAlign: 'left', fontSize: '14px', lineHeight: '1.6' }}>
          <div>✅ Vite开发服务器: 正常运行</div>
          <div>✅ React组件: 正常渲染</div>
          <div>✅ CSS样式: 内联样式工作</div>
          <div>✅ JavaScript事件: 可以交互</div>
          <div>✅ 控制台日志: 正常输出</div>
        </div>
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        fontSize: '12px',
        opacity: 0.7
      }}>
        Node.js v22.16.0 | Vite v5.4.19
      </div>
    </div>
  );
};

export default App;
