import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1e40af',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          MathChain Epoch
        </h1>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
          数链纪元
        </h2>
        <p style={{ fontSize: '18px' }}>
          页面加载成功！🎉
        </p>
        <button 
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
          onClick={() => alert('按钮点击成功！')}
        >
          测试按钮
        </button>
      </div>
    </div>
  );
};

export default App;
