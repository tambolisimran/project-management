import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>403 - Unauthorized</h1>
      <p style={styles.message}>You don't have permission to access this page.</p>
      <Link to="/" style={styles.link}>Return to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '100px',
  },
  title: {
    fontSize: '36px',
    color: '#ff4d4f',
  },
  message: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  link: {
    fontSize: '16px',
    textDecoration: 'none',
    color: '#1890ff',
  },
};

export default Unauthorized;
