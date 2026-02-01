import { jsPDF } from "jspdf"
import { PDFBranding } from "./export-engine"

export const BasePdfLayout = {
    /**
     * Renders the institutional header on the target page
     */
    renderHeader(doc: jsPDF, branding: PDFBranding, yOffset: number = 15): number {
        doc.setFontSize(22)
        doc.setFont("helvetica", "bold")
        doc.text(branding.schoolName, 105, yOffset, { align: "center" })

        let currentY = yOffset + 10

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        const contactInfo = [
            branding.address,
            branding.phone ? `Phone: ${branding.phone}` : null,
            branding.email ? `Email: ${branding.email}` : null,
            branding.eiin ? `EIIN: ${branding.eiin}` : null
        ].filter(Boolean).join(" | ")

        doc.text(contactInfo, 105, currentY, { align: "center" })
        currentY += 10

        doc.setLineWidth(0.5)
        doc.line(14, currentY, 196, currentY)

        return currentY + 12
    },

    /**
     * Renders a standardized footer with page numbers and institution name
     */
    renderFooter(doc: jsPDF, branding: PDFBranding) {
        const pageCount = (doc as any).internal.getNumberOfPages()

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(9)
            doc.setFont("helvetica", "italic")

            const footerText = `${branding.schoolName} - Official Institutional Record`
            doc.text(footerText, 14, 285)

            const pageText = `Page ${i} of ${pageCount}`
            doc.text(pageText, 196, 285, { align: "right" })

            doc.setLineWidth(0.2)
            doc.line(14, 282, 196, 282)
        }
    }
}
