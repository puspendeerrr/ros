import React from 'react';
import { motion } from 'framer-motion';
import logoIcon from '../assets/logo-icon.png';

export const SplashLoader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <motion.img 
        src={logoIcon} 
        alt="Restaurant OS Loader" 
        style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div style={{ marginTop: '24px', width: '120px', height: '3px', background: '#F1F5F9', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
        <motion.div 
          style={{ height: '100%', background: '#F97316', position: 'absolute', left: 0, top: 0 }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
};
