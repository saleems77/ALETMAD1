// تحديث CertificateTemplate مع عناصر الأمان
const SecurityFeatures = () => (
    <View style={styles.securityFeatures}>
      <Image
        src="/security-watermark.png"
        style={{ width: 120, opacity: 0.3 }}
      />
      <View style={styles.verificationBox}>
        <Text style={styles.verificationText}>رقم التحقق: {certificateId}</Text>
        <Text style={styles.verificationLink}>{verificationLink}</Text>
      </View>
    </View>
  );