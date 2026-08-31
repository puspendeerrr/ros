import React from 'react';

export const FoodVegIndicator: React.FC<{ isVeg: boolean }> = ({ isVeg }) => (
  <div style={{
    width: '12px',
    height: '12px',
    border: `1.5px solid ${isVeg ? '#16A34A' : '#DC2626'}`,
    padding: '1.5px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2px',
    background: '#FFFFFF',
    flexShrink: 0
  }}>
    <div style={{
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: isVeg ? '#16A34A' : '#DC2626'
    }} />
  </div>
);
