"use client"
import { useState, useEffect } from "react";
import { 
  Button,
  Space,
  DatePicker,
  Select,
  Empty,
  Skeleton,
  Card,
  Tooltip,
  ConfigProvider
} from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { 
  ProLayout,
  ProTable
} from '@ant-design/pro-components';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FileExcelOutlined, FilePdfOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/ar';
import { SyncOutlined } from '@ant-design/icons';
import arEG from 'antd/locale/ar_EG';

moment.locale('ar');

const { RangePicker } = DatePicker;

export default function ReportsDashboard() {
  const [filters, setFilters] = useState({
    type: 'all',
    role: 'all',
    date: []
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData([
        {
          id: 'R001',
          التاريخ: '2025-04-18',
          العنوان: 'تقرير المبيعات اليومي',
          النوع: 'يومي',
          الدور: 'موظف',
          المبيعات: 15000,
          المعاملات: 45
        },
        {
          id: 'R002',
          التاريخ: '2025-04-01',
          العنوان: 'تقرير التسويق الشهري',
          النوع: 'شهري',
          الدور: 'مدرب',
          الحملات: 8,
          العملاء_المحتملين: 1200
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredData = data.filter(report => {
    const dateMatch = filters.date.length 
      ? moment(report.التاريخ).isBetween(
          moment(filters.date[0]),
          moment(filters.date[1]),
          null, '[]'
        )
      : true;
    
    return dateMatch 
      && (filters.type === 'all' || report.النوع === filters.type)
      && (filters.role === 'all' || report.الدور === filters.role);
  });

  // تصدير PDF مع جميع الحقول
const handleExportPDF = () => {
  const doc = new jsPDF();
  const columns = filteredData.length > 0 
    ? Object.keys(filteredData[0])
        .filter(k => k !== 'id')
        .map(k => ({ 
          header: k.replace(/_/g, ' '), 
          dataKey: k 
        }))
    : [];

  if (filteredData.length > 0) {
    doc.autoTable({
      head: [columns.map(col => col.header)],
      body: filteredData.map(row => 
        columns.map(col => row[col.dataKey] || '-')
      ),
      styles: { 
        font: 'aealarabiya', 
        fontSize: 12,
        halign: 'right'
      },
      headStyles: { 
        fillColor: [42, 119, 201],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
  }
  
  doc.save('التقارير.pdf');
};

  const columns = [
    { 
      title: 'التاريخ', 
      dataIndex: 'التاريخ', 
      sorter: true,
      render: (text) => moment(text).format('YYYY-MM-DD')
    },
    { 
      title: 'العنوان', 
      dataIndex: 'العنوان', 
      ellipsis: true 
    },
    { 
      title: 'النوع', 
      dataIndex: 'النوع', 
      filters: [
        { text: 'يومي', value: 'يومي' },
        { text: 'شهري', value: 'شهري' }
      ]
    },
    { 
      title: 'المبيعات', 
      dataIndex: 'المبيعات',
      render: (text) => text ? `ر.س ${text}` : '-',
      sorter: (a, b) => a.المبيعات - b.المبيعات
    },
    { 
      title: 'العمليات',
      render: (_, record) => (
        <Space>
          <Tooltip title="معاينة التقرير">
            <Button icon={<EyeOutlined />} type="primary" ghost />
          </Tooltip>
          <Tooltip title="عرض التفاصيل الكاملة">
            <Button type="primary">تفاصيل التقرير</Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <ConfigProvider
      direction="rtl"
      locale={arEG}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          fontFamily: 'Tajawal, sans-serif',
        }
    }}>
      <ProLayout
        title="لوحة التقارير الإدارية"
        navTheme="realDark"
        layout="mix"
        contentStyle={{ padding: 24 }}
        menu={{
          locale: false,
          items: [
            { key: 'reports', label: 'إدارة التقارير' },
            { key: 'settings', label: 'إعدادات النظام' }
          ]
        }}
        header={{
          title: "نظام إدارة التقارير",
          subTitle: "لوحة التحكم الرئيسية",
          extra: [
            <Button 
              key="refresh" 
              icon={<SyncOutlined />} 
              onClick={() => window.location.reload()}
            >
              تحديث البيانات
            </Button>
          ]
        }}
        locale="ar"
      >
        <Card className="mb-6" title="أدوات الفلترة">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space wrap>
              <RangePicker 
                onChange={(dates) => setFilters({ ...filters, date: dates })}
                placeholder={['تاريخ البدء', 'تاريخ الانتهاء']}
                style={{ width: 280 }}
                allowClear
                format="YYYY-MM-DD"
              />
              
              <Select 
                value={filters.type}
                onChange={(type) => setFilters({ ...filters, type })}
                options={[
                  { value: 'all', label: 'جميع الأنواع' },
                  { value: 'يومي', label: 'تقارير يومية' },
                  { value: 'شهري', label: 'تقارير شهرية' },
                  { value: 'سنوي', label: 'تقارير سنوية' }
                ]}
                style={{ width: 200 }}
                showSearch
                placeholder="اختر نوع التقرير"
              />
              
              <Select 
                value={filters.role}
                onChange={(role) => setFilters({ ...filters, role })}
                options={[
                  { value: 'all', label: 'جميع الأدوار' },
                  { value: 'موظف', label: 'تقارير الموظفين' },
                  { value: 'مدرب', label: 'تقارير المدربين' },
                  { value: 'طالب', label: 'تقارير الطلاب' }
                ]}
                style={{ width: 200 }}
                showSearch
                placeholder="اختر الدور"
              />
              
              <CSVLink 
                data={filteredData} 
                filename="التقارير_الإدارية.csv"
                className="ant-btn ant-btn-primary"
              >
                <FileExcelOutlined /> تصدير إكسل
              </CSVLink>
              
              <Button 
                icon={<FilePdfOutlined />} 
                onClick={handleExportPDF}
                type="primary"
                danger
              >
                تصدير PDF
              </Button>
            </Space>
          </Space>
        </Card>

        <Card title="قائمة التقارير">
          {loading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <ProTable
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                locale: {
                  items_per_page: 'عناصر لكل صفحة',
                  jump_to: 'انتقل إلى',
                  page: 'الصفحة',
                  prev_page: 'الصفحة السابقة',
                  next_page: 'الصفحة التالية',
                  prev_5: '5 صفحات سابقة',
                  next_5: '5 صفحات تالية',
                }
              }}
              options={{
                density: true,
                fullScreen: true,
                reload: false
              }}
              scroll={{ x: 'max-content' }}
              locale={{
                emptyText: <Empty description="لا توجد بيانات مطابقة لمعايير البحث" />,
                search: 'بحث',
                reset: 'إعادة تعيين'
              }}
              search={false}
              dateFormatter="string"
              headerTitle="التقارير المتاحة"
              toolBarRender={() => [
                <Tooltip title="إعادة تعيين الفلاتر">
                  <Button 
                    icon={<ClearOutlined />} 
                    onClick={() => setFilters({ type: 'all', role: 'all', date: [] })}
                  >
                    إعادة الضبط
                  </Button>
                </Tooltip>
              ]}
            />
          )}
        </Card>
      </ProLayout>
    </ConfigProvider>
  );
}