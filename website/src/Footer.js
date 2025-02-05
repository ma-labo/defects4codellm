import React from 'react';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <div style={{ padding: '10px', textAlign: 'center' }}>
      <Typography variant="body2" color="textSecondary">
          © University of Alberta, University of Illinois Urbana-Champaign, The University of Tokyo, Purdue University
      </Typography>
    </div>
  );
};

export default Footer;