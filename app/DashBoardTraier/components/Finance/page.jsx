"use client"
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ArrowDownward, 
  AttachMoney, 
  InsertChart, 
  AccountBalanceWallet, 
  Download,
  Paid,
  AccountBalance,
  CurrencyExchange
} from '@mui/icons-material';
import { 
  PieChart, 
  Pie, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';

// نظام الألوان مع النسب المحددة
const themeColors = {
  blue: '#008DCB',    // 10%
  black: '#0D1012',   // 5%
  gray: '#999999',    // 20%
  red: '#E2101E',     // 7%
  white: '#FFFFFF',   // 50%
  yellow: '#F9D011'   // 8%
};

// أنيميشنات مخصصة
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02 }
};

const dummyData = {
  totalEarnings: 24500,
  monthlyEarnings: 8500,
  withdrawals: 12000,
  pendingBalance: 4500,
  earningsData: [
    { month: 'Jan', earnings: 4000 },
    { month: 'Feb', earnings: 3000 },
    { month: 'Mar', earnings: 5000 },
    { month: 'Apr', earnings: 8500 },
  ],
  transactions: [
    { id: 1, date: '2024-03-15', course: 'React Advanced', amount: 1500, status: 'Completed' },
    { id: 2, date: '2024-04-02', course: 'UI/UX Pro', amount: 2500, status: 'Pending' },
    { id: 3, date: '2024-05-20', course: 'Web Development', amount: 4500, status: 'Completed' },
  ],
  revenueSources: [
    { name: 'Direct Sales', value: 4000 },
    { name: 'Subscriptions', value: 6500 },
    { name: 'Partnerships', value: 2000 },
  ]
};

const FinanceDashboard = () => {
  const [state, setState] = useState({
    withdrawAmount: '',
    selectedMethod: '',
    filterStatus: 'all',
    searchQuery: '',
    isLoading: false
  });
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredTransactions = dummyData.transactions.filter(t => {
    const matchesStatus = state.filterStatus === 'all' || t.status === state.filterStatus;
    const matchesSearch = t.course.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleWithdraw = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      enqueueSnackbar('تمت عملية السحب بنجاح', { variant: 'success' });
      setState(prev => ({ ...prev, withdrawAmount: '', isLoading: false }));
    } catch (error) {
      enqueueSnackbar('فشل في عملية السحب', { variant: 'error' });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dummyData.transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "Financial_Report.xlsx");
  };

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 4,
      backgroundColor: themeColors.white,
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      {/* العنوان الرئيسي */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          mb: 4,
          borderBottom: `2px solid ${themeColors.gray}`,
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h4" sx={{
            color: themeColors.black,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <AccountBalanceWallet sx={{ 
              fontSize: 40,
              color: themeColors.blue,
              borderRadius: '50%',
              p: 1,
              backgroundColor: `${themeColors.blue}10`
            }} />
            لوحة التحكم المالية
          </Typography>
          
          <Chip
            label="الحالة المالية: نشطة"
            sx={{ 
              borderColor: themeColors.blue,
              color: themeColors.blue,
              fontWeight: 600,
              backgroundColor: `${themeColors.blue}10`
            }}
            variant="outlined"
          />
        </Box>
      </motion.div>

      {/* بطاقات الإحصائيات */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            title: 'إجمالي الأرباح', 
            value: `$${dummyData.totalEarnings}`, 
            icon: <Paid sx={{ fontSize: 32 }}/>, 
            progress: 75,
            color: themeColors.blue 
          },
          { 
            title: 'أرباح هذا الشهر', 
            value: `$${dummyData.monthlyEarnings}`, 
            icon: <InsertChart sx={{ fontSize: 32 }}/>, 
            progress: 45,
            color: themeColors.yellow 
          },
          { 
            title: 'السحوبات', 
            value: `$${dummyData.withdrawals}`, 
            icon: <ArrowDownward sx={{ fontSize: 32 }}/>, 
            progress: 60,
            color: themeColors.red 
          },
          { 
            title: 'الرصيد المعلق', 
            value: `$${dummyData.pendingBalance}`, 
            icon: <AccountBalanceWallet sx={{ fontSize: 32 }}/>, 
            progress: 30,
            color: themeColors.gray 
          },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover="hover"
            >
              <Paper sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: themeColors.white,
                boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: `${card.color}10`
                }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={card.progress} 
                    sx={{ 
                      height: 4,
                      backgroundColor: 'transparent',
                      '.MuiLinearProgress-bar': {
                        backgroundColor: card.color
                      }
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      color: themeColors.black,
                      mb: 1,
                      fontWeight: 600
                    }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      color: card.color
                    }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{
                    backgroundColor: `${card.color}10`,
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {React.cloneElement(card.icon, { sx: { color: card.color } })}
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* المخططات */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <motion.div whileHover={{ scale: 1.01 }}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 4,
              backgroundColor: themeColors.white,
              boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ 
                mb: 3,
                color: themeColors.black,
                fontWeight: 600
              }}>
                تحليل الأرباح الشهري
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={dummyData.earningsData}>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={themeColors.blue} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={themeColors.blue} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: themeColors.black }}
                    axisLine={{ stroke: themeColors.gray }}
                  />
                  <YAxis 
                    tick={{ fill: themeColors.black }}
                    axisLine={{ stroke: themeColors.gray }}
                  />
                  <Tooltip 
                    contentStyle={{
                      borderRadius: 8,
                      borderColor: themeColors.blue,
                      boxShadow: theme.shadows[3]
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke={themeColors.blue}
                    strokeWidth={2}
                    fill="url(#gradient)"
                    activeDot={{ r: 6, fill: themeColors.blue }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ scale: 1.01 }}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 4,
              backgroundColor: themeColors.white,
              boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ 
                mb: 3,
                color: themeColors.black,
                fontWeight: 600
              }}>
                مصادر الإيرادات
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={dummyData.revenueSources}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {dummyData.revenueSources.map((entry, index) => (
                      <Cell 
                        key={index} 
                        fill={[
                          themeColors.blue,
                          themeColors.yellow,
                          themeColors.gray
                        ][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      borderRadius: 8,
                      borderColor: themeColors.blue,
                      boxShadow: theme.shadows[3]
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* نموذج السحب */}
      <Paper sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 4,
        backgroundColor: themeColors.white,
        boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="h6" sx={{ 
          mb: 3,
          color: themeColors.black,
          fontWeight: 600
        }}>
          طلب سحب الأرباح
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: themeColors.gray }}>طريقة السحب</InputLabel>
              <Select
                value={state.selectedMethod}
                onChange={(e) => setState(prev => ({ ...prev, selectedMethod: e.target.value }))}
                sx={{
                  borderRadius: 3,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: themeColors.gray
                  }
                }}
              >
                <MenuItem value="paypal">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <img src="/paypal-logo.png" alt="PayPal" style={{ height: 20 }} />
                    PayPal
                  </Box>
                </MenuItem>
                <MenuItem value="bank">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AccountBalance sx={{ color: themeColors.blue }} />
                    حساب بنكي
                  </Box>
                </MenuItem>
                <MenuItem value="crypto">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CurrencyExchange sx={{ color: themeColors.blue }} />
                    محفظة رقمية
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="المبلغ المطلوب"
              type="number"
              value={state.withdrawAmount}
              onChange={(e) => setState(prev => ({ ...prev, withdrawAmount: e.target.value }))}
              sx={{ 
                borderRadius: 3,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: themeColors.gray
                  }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleWithdraw}
              disabled={state.isLoading}
              sx={{
                height: '56px',
                borderRadius: 3,
                backgroundColor: themeColors.blue,
                '&:hover': { backgroundColor: '#006699' },
                '&:disabled': { backgroundColor: themeColors.gray }
              }}
            >
              {state.isLoading ? 'جاري المعالجة...' : 'تأكيد السحب'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* جدول العمليات */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: 4,
        backgroundColor: themeColors.white,
        boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h6" sx={{ 
            color: themeColors.black,
            fontWeight: 600
          }}>
            السجلات المالية
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="بحث..."
              value={state.searchQuery}
              onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: themeColors.gray
                  }
                }
              }}
            />
            <Select
              value={state.filterStatus}
              onChange={(e) => setState(prev => ({ ...prev, filterStatus: e.target.value }))}
              sx={{
                borderRadius: 3,
                minWidth: 120,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: themeColors.gray
                }
              }}
            >
              <MenuItem value="all">جميع الحالات</MenuItem>
              <MenuItem value="Completed">مكتملة</MenuItem>
              <MenuItem value="Pending">معلقة</MenuItem>
            </Select>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExportExcel}
              sx={{
                borderRadius: 3,
                borderColor: themeColors.blue,
                color: themeColors.blue,
                '&:hover': { 
                  backgroundColor: `${themeColors.blue}10`,
                  borderColor: themeColors.blue
                }
              }}
            >
              تصدير Excel
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: `${themeColors.blue}05`,
                '& th': {
                  fontWeight: 600,
                  color: themeColors.black,
                  borderBottom: `2px solid ${themeColors.gray}`
                }
              }}>
                <TableCell>التاريخ</TableCell>
                <TableCell>الدورة</TableCell>
                <TableCell align="right">المبلغ</TableCell>
                <TableCell align="center">الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  hover
                  sx={{ 
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': { backgroundColor: `${themeColors.blue}03` }
                  }}
                >
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.course}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      justifyContent: 'flex-end'
                    }}>
                      <AttachMoney sx={{ 
                        color: themeColors.blue,
                        fontSize: 18 
                      }}/>
                      {transaction.amount}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={transaction.status}
                      sx={{
                        backgroundColor: transaction.status === 'Completed' 
                          ? `${themeColors.blue}10` 
                          : `${themeColors.red}10`,
                        color: transaction.status === 'Completed' 
                          ? themeColors.blue 
                          : themeColors.red,
                        fontWeight: 600,
                        borderRadius: 2
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FinanceDashboard;