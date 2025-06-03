// src/components/AdvancedAnalytics.jsx
"use client";
import { 
  Card, 
  Typography, 
  Grid, 
  LinearProgress, 
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // الاستيراد الصحيح هنا
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart, 
  Pie,
  Cell
} from 'recharts';
import { Info, Refresh } from '@mui/icons-material';
import { styled } from '@mui/system';

const ChartCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: theme.palette?.background?.paper || '#ffffff',
  boxShadow: theme.shadows?.[5] || '0px 3px 5px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));


const AdvancedAnalytics = ({ posts, clients, engagementData }) => {
  const theme = useTheme();

  // بيانات افتراضية للرسم البياني
  const demoData = Array.isArray(engagementData) ? engagementData : [
    { name: 'فيسبوك', value: 2400 },
    { name: 'إنستجرام', value: 4567 },
    { name: 'تيك توك', value: 1398 },
    { name: 'تويتر', value: 9800 },
  ];

  // ألوان مخصصة للتدرج
  const COLORS = [
    theme.palette?.primary?.main || '#1976d2',
  theme.palette?.secondary?.main || '#dc004e',
  theme.palette?.success?.main || '#4CAF50',
  theme.palette?.warning?.main || '#FF9800'
  ];

  return (
    <ChartCard>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          📊 التحليلات المتقدمة
          <Tooltip title="بيانات تفاعلية يتم تحديثها كل 5 دقائق">
            <IconButton size="small">
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        
        <IconButton color="primary">
          <Refresh />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* مؤشرات الأداء */}
        <Grid item xs={12} md={3}>
          <MetricCard
            title="معدل التفاعل"
            value="8.4%"
            progress={65}
            color={theme.palette.primary.main}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <MetricCard
            title="الوصول اليومي"
            value="12.4K"
            progress={85}
            color={theme.palette.secondary.main}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <MetricCard
            title="المتابعون الجدد"
            value="1.2K"
            progress={45}
            color={theme.palette.success.main}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <MetricCard
            title="معدل التحويل"
            value="3.8%"
            progress={75}
            color={theme.palette.warning.main}
          />
        </Grid>

        {/* الرسوم البيانية */}
        <Grid item xs={12} md={8}>
          <Box sx={{ height: 300 }}>
            <Typography variant="h6" gutterBottom>
              أداء المحتوى خلال الأسبوع
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={demoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar 
                  dataKey="value" 
                  fill={theme.palette.primary.main}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ height: 300 }}>
            <Typography variant="h6" gutterBottom>
              توزيع المنصات
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={demoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demoData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </ChartCard>
  );
};

// مكون بطاقة المؤشر المساعد
const MetricCard = ({ title, value, progress, color }) => (
  <Card sx={{ 
    p: 2, 
    borderRadius: 3,
    borderLeft: `4px solid ${color}`,
    transition: '0.3s',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  }}>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="h4" sx={{ my: 1 }}>
      {value}
    </Typography>
    <LinearProgress 
      variant="determinate" 
      value={progress} 
      sx={{ 
        height: 8, 
        borderRadius: 4,
        '& .MuiLinearProgress-bar': {
          backgroundColor: color
        }
      }}
    />
  </Card>
);

export default AdvancedAnalytics;