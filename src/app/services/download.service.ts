import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  downloadBlob(
    content: BlobPart | BlobPart[],
    filename: string,
    mime = 'application/octet-stream'
  ): void {
    const blob = new Blob(Array.isArray(content) ? content : [content], {
      type: mime,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadText(
    text: string,
    filename: string,
    mime = 'text/plain;charset=utf-8'
  ): void {
    this.downloadBlob(text, filename, mime);
  }

  downloadAsPDF(title: string, data: any[]): void {
    const doc = new jsPDF();
    const finalTitle = `${title}_${new Date().toLocaleDateString().replace(/\//g, '-')}`;

    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(new Date().toLocaleDateString(), 14, 22);

    // Add table
    autoTable(doc, {
      head: [Object.keys(data[0])],
      body: data.map((obj) => Object.values(obj)),
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    // Save the PDF
    doc.save(`${finalTitle}.pdf`);
  }
}
