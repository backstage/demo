import React from 'react';

export const HomePage = () => {
  // Define some basic styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',  // Makes the container take up the full viewport height
    backgroundColor: '#282c34', // Dark background
    color: 'white', // Text color
    fontFamily: '"Arial", sans-serif'
  };

  const headingStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  };

  const subHeadingStyle = {
    fontSize: '1.5rem'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Hello Shiva</h1>
      <p style={subHeadingStyle}>Welcome to Backstage!</p>
    </div>
  );
};
