import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 24, marginBottom: 20 },
  table: { display: 'table', width: '100%' },
  row: { flexDirection: 'row', borderBottom: '1pt solid #ddd' },
  cell: { padding: 5, width: '50%' }
});

export default function InvoiceTemplate({ id, date, items, total }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>فاتورة # {id}</Text>
        
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cell}>الوصف</Text>
            <Text style={styles.cell}>المبلغ</Text>
          </View>
          
          {items.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{item.description}</Text>
              <Text style={styles.cell}>{item.amount} ر.س</Text>
            </View>
          ))}
        </View>

        <Text style={{ marginTop: 20 }}>الإجمالي: {total} ر.س</Text>
      </Page>
    </Document>
  );
}