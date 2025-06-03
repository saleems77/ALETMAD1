'use client';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    position: 'relative' // لإتاحة العناصر المطلقة داخل الصفحة
  },
  header: {
    textAlign: 'center',
    marginBottom: 30
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15
  },
  recipient: {
    fontSize: 22,
    color: '#4a5568',
    marginBottom: 10
  },
  body: {
    marginVertical: 20,
    textAlign: 'center'
  },
  details: {
    fontSize: 16,
    marginBottom: 8
  },
  qrContainer: {
    marginTop: 30,
    alignItems: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: '#718096'
  },
  securityFeatures: {
    position: 'absolute',
    opacity: 0.1,
    zIndex: -1,
    transform: 'rotate(30deg)',
    fontSize: 40 // لتمييز النص الأمني
  },
  verificationSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f7fafc',
    borderRadius: 8
  },
  signatureSection: {
    marginTop: 40,
    alignItems: 'center'
  }
});

export default function CertificateTemplate({
  recipientName,
  courseName,
  issueDate,
  instructorName,
  courseDuration,
  certificateData // أضيفت هذه الـ prop
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* عناصر الأمان الخفية */}
        <Text style={[styles.securityFeatures, { top: 100, left: 50 }]}>
          {certificateData?.certificateId || 'N/A'}
        </Text>
        <Image
          src="/path/to/watermark.png"
          style={[styles.securityFeatures, { width: '100%', height: '100%' }]}
        />

        {/* المحتوى الديناميكي */}
        <View style={styles.header}>
          <Text style={styles.title}>شهادة إتمام دورة</Text>
          <Text style={styles.recipient}>{recipientName}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.details}>
            تاريخ الإصدار: {issueDate ? new Date(issueDate).toLocaleDateString('ar-SA') : 'غير محدد'}
          </Text>
        </View>

        {/* قسم التحقق من الشهادة */}
        <View style={styles.verificationSection}>
          <Text>رقم التحقق: {certificateData?.verificationCode || 'N/A'}</Text>
          <Text>تاريخ الانتهاء: {certificateData?.expiryDate || 'N/A'}</Text>
          <Link src={certificateData?.verificationUrl || '#'}>
            اضغط هنا للتحقق من الشهادة
          </Link>
        </View>

        {/* التوقيع الإلكتروني */}
        <View style={styles.signatureSection}>
          <Image src="/path/to/digital-signature.png" style={{ width: 150 }} />
          <Text>التوقيع الإلكتروني المعتمد</Text>
          <Text>{new Date().toLocaleDateString('ar-SA')}</Text>
        </View>

        <Text style={styles.footer}>
          هذه الشهادة صادرة إلكترونيًا وتخضع لشروط الخصوصية والأمان
        </Text>
      </Page>
    </Document>
  );
}