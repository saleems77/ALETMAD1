module.exports = {
  async generatePdf(certificateId, studentName) {
    const certificate = await super.findOne(certificateId, { populate: "*" });
    // استبدال [الاسم] باسم الطالب في محتوى الشهادة
    const personalizedContent = certificate.content.replace(
      /\[الاسم\]/g,
      studentName
    );
    // توليد PDF باستخدام مكتبة (مثل pdfkit أو jspdf)
    return await this.generatePdfBuffer(personalizedContent);
  },
};
