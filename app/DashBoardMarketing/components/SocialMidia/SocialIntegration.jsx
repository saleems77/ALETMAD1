// src/components/SocialIntegration.jsx
"use client";
import { Card, Typography, Avatar, Chip } from '@mui/material';
import PropTypes from 'prop-types';

const SocialIntegration = ({ accounts = [] }) => { // قيمة افتراضية لمصفوفة فارغة
  return (
    <Card sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" gutterBottom>
        الحسابات المتصلة
      </Typography>
      
      <div className="social-accounts">
        {/* التحقق من أن accounts مصفوفة قبل استخدام map */}
        {(Array.isArray(accounts) ? accounts : []).map(account => (
          <div key={account.id} className="account-item">
            <Avatar 
              src={`/icons/${account.platform}.svg`}
              sx={{ bgcolor: 'transparent', width: 40, height: 40 }}
            />
            <div className="account-info">
              <Typography variant="body1">{account.platform}</Typography>
              <Chip 
                label={account.status || 'غير متصل'}
                color={account.status === 'متصل' ? 'success' : 'error'}
                size="small"
                sx={{ mt: 1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// تحقق من أنواع البيانات
SocialIntegration.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      platform: PropTypes.string.isRequired,
      status: PropTypes.string
    })
  )
};

export default SocialIntegration;