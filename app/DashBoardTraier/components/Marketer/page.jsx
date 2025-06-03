"use client"
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Skeleton,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
  Tooltip,
  Avatar,
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ContentCopy,
  PersonAdd,
  AttachMoney,
  BarChart,
  Search,
  FilterList,
  Sort,
  VerifiedUser,
  Visibility,
  FileDownload,
  PieChart,
  TrendingUp
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// الألوان المخصصة مع تدرجات
const themeColors = {
  primary: '#008DCB',
  secondary: '#0D1012',
  success: '#4CAF50',
  error: '#E2101E',
  warning: '#F9D011',
  info: '#2196F3',
  background: '#F5F7FA',
  textPrimary: '#2D3748',
  textSecondary: '#718096'
};

// أنيميشن أساسي
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

// مكونات مخصصة
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: themeColors.background,
  },
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.3s ease-in-out',
    boxShadow: theme.shadows[2]
  },
}));
const dummyData = {
  marketers: [
    {
      id: 'mk1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      code: 'MKTR-5X9P',
      commissionRate: 15,
      totalSales: 45,
      earnings: 6750,
      status: 'active',
      registrationDate: '2024-01-15'
    },
    {
      id: 'mk2',
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      code: 'MKTR-3B2Q',
      commissionRate: 20,
      totalSales: 32,
      earnings: 5120,
      status: 'active',
      registrationDate: '2024-02-20'
    },
    // يمكن إضافة المزيد من البيانات هنا
  ]
};
const AnimatedCard = motion(Paper);

const MarketersSystem = () => {
  const [state, setState] = useState({
    openDialog: false,
    editMode: false,
    currentMarketer: {},
    formData: { name: '', email: '', commissionRate: '' },
    searchQuery: '',
    sortField: 'name',
    sortOrder: 'asc',
    page: 1,
    loading: true,
    error: null,
    notification: null,
    selectedMarketer: null,
    viewMode: false,
    totalStats: {}
  });

  const itemsPerPage = 5;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // محاكاة جلب البيانات من API
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        loading: false,
        totalStats: {
          totalMarketers: dummyData.marketers.length,
          totalSales: dummyData.marketers.reduce((sum, m) => sum + m.totalSales, 0),
          totalEarnings: dummyData.marketers.reduce((sum, m) => sum + m.earnings, 0),
          activeCampaigns: 12,
          conversionRate: 23.5
        }
      }));
    }, 1500);
  }, []);

  const generateUniqueCode = () => `MKTR-${uuidv4().substr(0, 5).toUpperCase()}`;

  const handleSubmit = () => {
    if (!state.formData.name || !state.formData.email || !state.formData.commissionRate) {
      setState(prev => ({ ...prev, notification: { type: 'error', message: 'جميع الحقول مطلوبة' } }));
      return;
    }

    const newMarketer = {
      id: uuidv4(),
      code: generateUniqueCode(),
      ...state.formData,
      totalSales: 0,
      earnings: 0,
      status: 'active',
      registrationDate: new Date().toISOString()
    };

    dummyData.marketers.push(newMarketer);
    handleClose();
    showNotification('success', 'تم إضافة المسوق بنجاح');
  };

  const handleSort = (field) => {
    setState(prev => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field ? (prev.sortOrder === 'asc' ? 'desc' : 'asc') : 'asc'
    }));
  };

  const handleSearch = (e) => {
    setState(prev => ({ ...prev, searchQuery: e.target.value, page: 1 }));
  };

  const filteredData = dummyData.marketers
    .filter(m =>
      m.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(state.searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const order = state.sortOrder === 'asc' ? 1 : -1;
      return a[state.sortField] > b[state.sortField] ? order : -order;
    });

  const paginatedData = filteredData.slice(
    (state.page - 1) * itemsPerPage,
    state.page * itemsPerPage
  );

  const handleClose = () => {
    setState(prev => ({
      ...prev,
      openDialog: false,
      viewMode: false,
      formData: { name: '', email: '', commissionRate: '' },
      editMode: false
    }));
  };

  const showNotification = (type, message) => {
    setState(prev => ({ ...prev, notification: { type, message } }));
    setTimeout(() => setState(prev => ({ ...prev, notification: null })), 3000);
  };

  const deleteMarketer = (id) => {
    dummyData.marketers = dummyData.marketers.filter(m => m.id !== id);
    showNotification('success', 'تم الحذف بنجاح');
  };

  const StatusBadge = ({ status }) => (
    <Chip
      label={status === 'active' ? 'نشط' : 'غير نشط'}
      sx={{
        backgroundColor: status === 'active' ? themeColors.success : themeColors.error,
        color: 'white',
        fontWeight: 'bold'
      }}
    />
  );

  return (
    <Box sx={{
      p: isMobile ? 2 : 4,
      backgroundColor: themeColors.background,
      minHeight: '100vh'
    }}>
      {/* شريط العنوان والإحصائيات */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h4" sx={{
              color: themeColors.textPrimary,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <BarChart sx={{ color: themeColors.primary }} />
              لوحة تحكم المسوقين
            </Typography>
            <Button
              variant="contained"
              startIcon={<FileDownload />}
              sx={{
                backgroundColor: themeColors.success,
                '&:hover': { backgroundColor: '#388E3C' }
              }}
            >
              تصدير البيانات
            </Button>
          </Box>

          {state.loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item}>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {[
                { 
                  title: 'المسوقين النشطين',
                  value: state.totalStats.totalMarketers,
                  icon: <VerifiedUser sx={{ fontSize: 40 }} />,
                  color: themeColors.primary,
                  progress: 75
                },
                { 
                  title: 'إجمالي المبيعات',
                  value: state.totalStats.totalSales,
                  icon: <TrendingUp sx={{ fontSize: 40 }} />,
                  color: themeColors.success,
                  progress: 45
                },
                { 
                  title: 'إجمالي الأرباح',
                  value: `$${state.totalStats.totalEarnings.toLocaleString()}`,
                  icon: <AttachMoney sx={{ fontSize: 40 }} />,
                  color: themeColors.warning,
                  progress: 60
                },
                { 
                  title: 'معدل التحويل',
                  value: `${state.totalStats.conversionRate}%`,
                  icon: <PieChart sx={{ fontSize: 40 }} />,
                  color: themeColors.error,
                  progress: state.totalStats.conversionRate
                }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <AnimatedCard
                    variants={fadeIn}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: 'white',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: themeColors.textSecondary }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Avatar sx={{ 
                        backgroundColor: `${stat.color}20`, 
                        color: stat.color,
                        width: 56,
                        height: 56
                      }}>
                        {stat.icon}
                      </Avatar>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={stat.progress} 
                      sx={{ 
                        mt: 2,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: `${stat.color}20`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: stat.color
                        }
                      }} 
                    />
                  </AnimatedCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </motion.div>

      {/* شريط البحث والتحكم */}
      <Paper sx={{
        mb: 2,
        p: 2,
        borderRadius: 3,
        backgroundColor: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          alignItems: 'center'
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="ابحث عن مسوق..."
            InputProps={{
              startAdornment: <Search sx={{ color: themeColors.textSecondary, mr: 1 }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: themeColors.background
              }
            }}
            value={state.searchQuery}
            onChange={handleSearch}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{
              borderRadius: 3,
              borderColor: themeColors.textSecondary,
              color: themeColors.textPrimary
            }}
          >
            الفلاتر
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setState(prev => ({ ...prev, openDialog: true }))}
            sx={{
              borderRadius: 3,
              backgroundColor: themeColors.primary,
              '&:hover': { backgroundColor: '#006699' }
            }}
          >
            مسوق جديد
          </Button>
        </Box>
      </Paper>

      {/* جدول البيانات */}
      {state.loading ? (
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
      ) : (
        <motion.div variants={fadeIn}>
          <Paper sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: themeColors.background }}>
                  <TableRow>
                    {[
                      { field: 'name', label: 'الاسم' },
                      { field: 'code', label: 'الكود' },
                      { field: 'commissionRate', label: 'العمولة' },
                      { field: 'totalSales', label: 'المبيعات' },
                      { field: 'earnings', label: 'الأرباح' },
                      { field: 'status', label: 'الحالة' },
                      { label: 'الإجراءات' }
                    ].map((header, index) => (
                      <TableCell key={index}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: header.field ? 'pointer' : 'default'
                        }} onClick={() => header.field && handleSort(header.field)}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {header.label}
                          </Typography>
                          {header.field && (
                            <Sort sx={{ 
                              fontSize: 16,
                              ml: 1,
                              transform: state.sortOrder === 'asc' ? 'rotate(180deg)' : 'none',
                              color: state.sortField === header.field ? themeColors.primary : 'inherit'
                            }} />
                          )}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((marketer) => (
                    <StyledTableRow key={marketer.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            backgroundColor: `${themeColors.primary}20`, 
                            color: themeColors.primary
                          }}>
                            {marketer.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 'bold' }}>{marketer.name}</Typography>
                            <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                              {marketer.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="نسخ الكود">
                          <Chip
                            label={marketer.code}
                            icon={<ContentCopy sx={{ fontSize: 16 }} />}
                            onClick={() => navigator.clipboard.writeText(marketer.code)}
                            sx={{ 
                              backgroundColor: `${themeColors.primary}10`,
                              color: themeColors.primary,
                              '&:hover': { backgroundColor: `${themeColors.primary}20` }
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${marketer.commissionRate}%`}
                          sx={{
                            backgroundColor: `${themeColors.warning}10`,
                            color: themeColors.textPrimary,
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          color="primary"
                          badgeContent={`+${marketer.totalSales}`}
                          sx={{ '& .MuiBadge-badge': { right: -15, top: 10 } }}
                        >
                          <TrendingUp sx={{ color: themeColors.success }} />
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ 
                          color: themeColors.success,
                          fontWeight: 'bold'
                        }}>
                          ${marketer.earnings.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={marketer.status} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="عرض التفاصيل">
                            <IconButton
                              sx={{ color: themeColors.textSecondary }}
                              onClick={() => setState(prev => ({
                                ...prev,
                                selectedMarketer: marketer,
                                viewMode: true
                              }))}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="تعديل">
                            <IconButton
                              sx={{ color: themeColors.primary }}
                              onClick={() => setState(prev => ({
                                ...prev,
                                currentMarketer: marketer,
                                editMode: true,
                                openDialog: true,
                                formData: {
                                  name: marketer.name,
                                  email: marketer.email,
                                  commissionRate: marketer.commissionRate
                                }
                              }))}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="حذف">
                            <IconButton
                              sx={{ color: themeColors.error }}
                              onClick={() => {
                                if (window.confirm('هل أنت متأكد من الحذف؟')) {
                                  deleteMarketer(marketer.id);
                                }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* التذييل والتقسيم */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderTop: `1px solid ${themeColors.background}`
            }}>
              <Typography sx={{ color: themeColors.textSecondary }}>
                عرض {Math.min(itemsPerPage, filteredData.length)} من {filteredData.length} نتيجة
              </Typography>
              <Pagination
                count={Math.ceil(filteredData.length / itemsPerPage)}
                page={state.page}
                onChange={(e, page) => setState(prev => ({ ...prev, page }))}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* نافذة التفاصيل */}
      <Dialog 
        fullWidth 
        maxWidth="md" 
        open={state.viewMode} 
        onClose={() => setState(prev => ({ ...prev, viewMode: false }))}
      >
        <DialogTitle sx={{ 
          backgroundColor: themeColors.background,
          borderBottom: `1px solid ${themeColors.background}`,
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              backgroundColor: `${themeColors.primary}20`, 
              color: themeColors.primary
            }}>
              {state.selectedMarketer?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {state.selectedMarketer?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          {state.selectedMarketer && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, color: themeColors.textSecondary }}>
                  المعلومات الأساسية
                </Typography>
                <Box sx={{ 
                  backgroundColor: themeColors.background,
                  borderRadius: 3,
                  p: 3
                }}>
                  <DetailItem label="البريد الإلكتروني" value={state.selectedMarketer.email} />
                  <DetailItem label="تاريخ التسجيل" value={new Date().toLocaleDateString()} />
                  <DetailItem label="الحالة" value={<StatusBadge status={state.selectedMarketer.status} />} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, color: themeColors.textSecondary }}>
                  الإحصائيات
                </Typography>
                <Box sx={{ 
                  backgroundColor: themeColors.background,
                  borderRadius: 3,
                  p: 3
                }}>
                  <DetailItem label="إجمالي المبيعات" value={state.selectedMarketer.totalSales} />
                  <DetailItem label="إجمالي الأرباح" value={`$${state.selectedMarketer.earnings.toLocaleString()}`} />
                  <DetailItem label="نسبة التحويل" value="23%" />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* إشعارات */}
      <Snackbar
        open={!!state.notification}
        autoHideDuration={3000}
        onClose={() => setState(prev => ({ ...prev, notification: null }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert 
          severity={state.notification?.type} 
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {state.notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const DetailItem = ({ label, value }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    mb: 2,
    '&:last-child': { mb: 0 }
  }}>
    <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
      {value}
    </Typography>
  </Box>
);

export default MarketersSystem;