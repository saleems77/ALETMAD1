"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/Buttonn';
import { exportToCSV, exportToPDF, exportToExcel } from '@/utils/exporters';
import { FiFileText, FiFile, FiDownload } from 'react-icons/fi';
import PropTypes from 'prop-types';

const ExportControls = ({ transactions }) => {
  const [isExporting, setIsExporting] = useState(null);
  const [error, setError] = useState(null);

  const handleExport = async (format) => {
    try {
      setIsExporting(format);
      setError(null);

      if (!transactions?.length) {
        throw new Error('لا توجد بيانات للتصدير');
      }

      switch (format) {
        case 'csv':
          await exportToCSV(transactions, 'financial-report');
          break;
        case 'pdf':
          await exportToPDF(transactions, 'financial-report');
          break;
        case 'excel':
          await exportToExcel(transactions, 'financial-report');
          break;
        default:
          throw new Error('صيغة غير مدعومة');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="export-controls space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => handleExport('csv')}
          disabled={!transactions?.length || isExporting}
          data-loading={isExporting === 'csv'}
        >
          {isExporting === 'csv' ? 'جاري التصدير...' : 'تصدير CSV'}
        </Button>

        <Button
          variant="outline"
          onClick={() => handleExport('pdf')}
          disabled={!transactions?.length || isExporting}
          loading={isExporting === 'pdf' ? "true" : undefined}
          icon={<FiFile />}
        >
          {isExporting === 'pdf' ? 'جاري التصدير...' : 'تصدير PDF'}
        </Button>

        <Button
          variant="outline"
          onClick={() => handleExport('excel')}
          disabled={!transactions?.length || isExporting}
          loading={isExporting === 'excel' ? "true" : undefined}
          icon={<FiDownload />}
        >
          {isExporting === 'excel' ? 'جاري التصدير...' : 'تصدير Excel'}
        </Button>
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-2">
          <FiAlertCircle className="inline mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

ExportControls.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ExportControls;