// src/components/AnalyticsOverview.jsx - نسخة مطورة
"use client";
import { Card, Typography, useTheme, LinearProgress, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { styled } from '@mui/system';

const StyledMetricCard = styled(Card)(({ theme }) => ({
  background: theme.palette.gradient.primary,
  color: theme.palette.common.white,
  padding: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: theme.shadows[10]
}));

const AnalyticsOverview = ({ posts, clients, engagementData }) => {
  const theme = useTheme();

  return (
    <StyledMetricCard>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
        📈 تحليلات الأداء المتقدمة
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <MetricItem 
            title="الوصول الإجمالي" 
            value="1.2M" 
            icon="🚀"
            progress={75}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricItem 
            title="معدل التفاعل" 
            value="8.4%" 
            icon="💡"
            progress={60}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricItem 
            title="التحويلات" 
            value="2.3K" 
            icon="💰"
            progress={85}
          />
        </Grid>
      </Grid>

      <Box sx={{ height: 300, mt: 4 }}>
        <Typography variant="h6" gutterBottom>أداء المحتوى</Typography>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={engagementData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="value" 
              fill={theme.palette.primary.main}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </StyledMetricCard>
  );
};

const MetricItem = ({ title, value, icon, progress }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography variant="h3" sx={{ mb: 1 }}>
      {icon} {value}
    </Typography>
    <Typography variant="subtitle2" sx={{ mb: 1 }}>{title}</Typography>
    <LinearProgress 
      variant="determinate" 
      value={progress} 
      sx={{ height: 8, borderRadius: 4 }}
    />
  </Box>
);

export default AnalyticsOverview;