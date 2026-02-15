// PDF export utility using jsPDF

export interface PDFData {
  sgpa?: {
    subjects: Array<{ name: string; credits: number; grade: string; isStarred?: boolean }>;
    sgpa: number;
    totalCredits: number;
    effectiveCredits?: number;
    mandatoryCredits?: number;
  };
  cgpa?: {
    semesters: Array<{ semester: string; sgpa: number; credits: number }>;
    cgpa: number;
    totalCredits: number;
  };
  gradingSystem: string;
}

export async function exportToPDF(data: PDFData): Promise<void> {
  // Dynamic import to ensure client-side only
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Title
  doc.setFontSize(20);
  doc.text('UniGPA - Grade Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Grading System
  doc.setFontSize(12);
  doc.text(`Grading System: ${data.gradingSystem}`, 20, yPos);
  yPos += 10;

  // SGPA Section
  if (data.sgpa) {
    doc.setFontSize(16);
    doc.text('SGPA Calculation', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.text('Subject', 20, yPos);
    doc.text('Credits', 80, yPos);
    doc.text('Grade', 120, yPos);
    doc.text('Mandatory', 150, yPos);
    yPos += 6;

    data.sgpa.subjects.forEach((subject) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      const subjectName = subject.isStarred ? `${subject.name} (*)` : subject.name;
      doc.text(subjectName, 20, yPos);
      doc.text(subject.credits.toString(), 80, yPos);
      doc.text(subject.grade, 120, yPos);
      doc.text(subject.isStarred ? 'Yes' : 'No', 150, yPos);
      yPos += 6;
    });

    yPos += 5;
    doc.setFontSize(12);
    doc.text(`Total Registered Credits: ${data.sgpa.totalCredits}`, 20, yPos);
    yPos += 6;
    if (data.sgpa.mandatoryCredits !== undefined) {
      doc.text(`Mandatory Credits: ${data.sgpa.mandatoryCredits}`, 20, yPos);
      yPos += 6;
    }
    if (data.sgpa.effectiveCredits !== undefined) {
      doc.text(`Effective GPA Credits: ${data.sgpa.effectiveCredits}`, 20, yPos);
      yPos += 6;
    }
    doc.setFontSize(14);
    doc.text(`SGPA: ${data.sgpa.sgpa.toFixed(2)}`, 20, yPos);
    yPos += 15;
  }

  // CGPA Section
  if (data.cgpa) {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.text('CGPA Calculation', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.text('Semester', 20, yPos);
    doc.text('SGPA', 80, yPos);
    doc.text('Credits', 120, yPos);
    yPos += 6;

    data.cgpa.semesters.forEach((sem) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(sem.semester, 20, yPos);
      doc.text(sem.sgpa.toFixed(2), 80, yPos);
      doc.text(sem.credits.toString(), 120, yPos);
      yPos += 6;
    });

    yPos += 5;
    doc.setFontSize(12);
    doc.text(`Total Credits: ${data.cgpa.totalCredits}`, 20, yPos);
    yPos += 6;
    doc.setFontSize(14);
    doc.text(`CGPA: ${data.cgpa.cgpa.toFixed(2)}`, 20, yPos);
  }

  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      'Built for Students Worldwide',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  doc.save('unigpa-report.pdf');
}

