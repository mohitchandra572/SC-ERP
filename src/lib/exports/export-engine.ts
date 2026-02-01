import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { auditService } from "../audit/audit-service"
import { BasePdfLayout } from "./pdf-layout"

export interface ExportColumn<T> {
    header: string
    key: keyof T | ((item: T) => any)
}

export interface PDFBranding {
    schoolName: string
    address?: string
    phone?: string
    email?: string
    eiin?: string
    logoUrl?: string
}

export const exportEngine = {
    /**
     * Generate a CSV string from an array of data
     */
    async toCSV<T>(data: T[], columns: ExportColumn<T>[], resourceName: string) {
        // Log the export event
        await auditService.logExport(resourceName, {
            count: data.length,
            columns: columns.map(c => c.header)
        })

        if (data.length === 0) return this.generateHeader(columns)

        const rows = data.map(item => {
            return columns.map(col => {
                const value = typeof col.key === 'function'
                    ? col.key(item)
                    : item[col.key]

                return this.escapeCSV(value)
            }).join(',')
        })

        return [this.generateHeader(columns), ...rows].join('\n')
    },

    /**
     * Generate a Response object for file download (CSV)
     */
    async toCSVResponse<T>(data: T[], columns: ExportColumn<T>[], filename: string, resourceName: string) {
        const csv = await this.toCSV(data, columns, resourceName)

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}.csv"`,
            }
        })
    },

    /**
     * Generate a PDF buffer from an array of data
     */
    async toPDF<T>(
        data: T[],
        columns: ExportColumn<T>[],
        title: string,
        resourceName: string,
        branding?: PDFBranding
    ) {
        const doc = new jsPDF()
        let yPos = 15

        // Enforce branding if provided, fallback to default if not but title is needed
        if (branding) {
            yPos = BasePdfLayout.renderHeader(doc, branding)
        }

        // Add Title
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.text(title, 14, yPos)
        yPos += 8

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, yPos)
        yPos += 10

        const headers = [columns.map(c => c.header)]
        const body = data.map(item => {
            return columns.map(col => {
                const value = typeof col.key === 'function'
                    ? col.key(item)
                    : item[col.key]
                return String(value ?? '')
            })
        })

            ; (doc as any).autoTable({
                startY: yPos,
                head: headers,
                body: body,
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                margin: { top: yPos },
            })

        // Apply Footer Branding
        if (branding) {
            BasePdfLayout.renderFooter(doc, branding)
        }

        // Log the export event after generation completes
        await auditService.logExport(resourceName, {
            count: data.length,
            format: 'PDF',
            columns: columns.map(c => c.header)
        })

        return Buffer.from(doc.output('arraybuffer'))
    },

    /**
     * Generate a Response object for file download (PDF)
     */
    async toPDFResponse<T>(
        data: T[],
        columns: ExportColumn<T>[],
        filename: string,
        title: string,
        resourceName: string,
        branding?: PDFBranding
    ) {
        const buffer = await this.toPDF(data, columns, title, resourceName, branding)

        return new Response(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}.pdf"`,
            }
        })
    },

    /**
     * Generate a branded Payslip PDF buffer
     */
    async toPayslipPDF(
        payslip: any,
        branding: PDFBranding
    ) {
        const doc = new jsPDF()
        let yPos = BasePdfLayout.renderHeader(doc, branding)

        // Title
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.text("SALARY PAYSLIP", 105, yPos, { align: 'center' })
        yPos += 15

        // Employee Info
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        const nameLabel = "Employee Name: "
        const valX = 14 + doc.getTextWidth(nameLabel)
        doc.text(nameLabel, 14, yPos)
        doc.setFont("helvetica", "normal")
        doc.text(payslip.staffProfile.user.fullName, valX, yPos)

        doc.setFont("helvetica", "bold")
        doc.text(`Month/Year: ${payslip.payrollRun.month}/${payslip.payrollRun.year}`, 140, yPos)
        yPos += 7

        doc.setFont("helvetica", "bold")
        doc.text("Designation: ", 14, yPos)
        doc.setFont("helvetica", "normal")
        doc.text(payslip.staffProfile.designation?.name || 'N/A', 14 + doc.getTextWidth("Designation: "), yPos)

        doc.setFont("helvetica", "bold")
        doc.text(`Department: ${payslip.staffProfile.department?.name || 'N/A'}`, 140, yPos)
        yPos += 12

        // Components Table
        const earnings = payslip.components.filter((c: any) => c.type === 'EARNING')
        const deductions = payslip.components.filter((c: any) => c.type === 'DEDUCTION')

        const tableBody = []
        const maxRows = Math.max(earnings.length, deductions.length)

        for (let i = 0; i < maxRows; i++) {
            tableBody.push([
                earnings[i]?.name || '',
                earnings[i]?.amount?.toFixed(2) || '',
                deductions[i]?.name || '',
                deductions[i]?.amount?.toFixed(2) || ''
            ])
        }

        ; (doc as any).autoTable({
            startY: yPos,
            head: [['Earnings', 'Amount', 'Deductions', 'Amount']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [52, 73, 94], textColor: 255 },
            styles: { fontSize: 10 },
        })

        yPos = (doc as any).lastAutoTable.finalY + 10

        // Summary
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.text(`Gross Earnings: ${payslip.grossAmount.toFixed(2)}`, 14, yPos)
        doc.text(`Total Deductions: ${(payslip.grossAmount - payslip.netAmount).toFixed(2)}`, 14, yPos + 7)

        doc.setFillColor(236, 240, 241)
        doc.rect(130, yPos - 5, 65, 15, 'F')
        doc.setFontSize(12)
        doc.text(`Net Pay: ${payslip.netAmount.toFixed(2)} BDT`, 135, yPos + 5)

        // Footer
        BasePdfLayout.renderFooter(doc, branding)

        // Log the export event
        await auditService.logExport('hr_payslips', {
            payslipId: payslip.id,
            employee: payslip.staffProfile.user.fullName,
            format: 'PDF'
        })

        return Buffer.from(doc.output('arraybuffer'))
    },

    /**
     * Internal helper to generate byte-order-mark and headers for Excel compatibility
     */
    generateHeader(columns: ExportColumn<any>[]) {
        const BOM = '\uFEFF' // Byte Order Mark for Excel CSV UTF-8 support
        return BOM + columns.map(c => this.generateHeaderCell(c.header)).join(',')
    },

    /**
     * Escapes values for CSV compliance (quotes, commas, newlines)
     */
    escapeCSV(val: any): string {
        if (val === null || val === undefined) return ''
        let str = String(val)

        // Escape double quotes by doubling them
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            str = `"${str.replace(/"/g, '""')}"`
        }

        return str
    },

    /**
     * Helper for header cell escaping
     */
    generateHeaderCell(val: string) {
        return this.escapeCSV(val)
    }
}
