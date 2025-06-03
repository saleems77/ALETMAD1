// ReportTable.jsx
import { Table, Input, Button } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const columns = [
  { title: 'التاريخ', dataIndex: 'date', sorter: (a, b) => new Date(a.date) - new Date(b.date) },
  { title: 'العنوان', dataIndex: 'title', ...getColumnSearchProps('title') },
  { title: 'النوع', dataIndex: 'type', filters: [
    { text: 'يومي', value: 'daily' },
    { text: 'شهري', value: 'monthly' }
  ]},
  { 
    title: 'العمليات',
    render: (_, record) => (
      <Space>
        <Button onClick={() => handleExportPDF(record)}>PDF</Button>
        <CSVLink data={[record]} filename={`${record.title}.csv`}>
          <Button>Excel</Button>
        </CSVLink>
      </Space>
    )
  }
];

// دالة تصدير PDF
const handleExportPDF = (data) => {
  const doc = new jsPDF();
  doc.autoTable({ html: '#reportTable' });
  doc.save(`${data.title}.pdf`);
};