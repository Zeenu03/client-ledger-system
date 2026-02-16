import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Format date as dd-Month Name-yyyy
const formatDateForPDF = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
  const month = monthNames[d.getMonth()]
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

export const generateLedgerPDF = (clientName, fromDate, toDate, transactions, totals) => {
  // Company details
  const companyName = "Gayatri Lemon  Compney"
  const companyAddress = "Kherva, Gujarat, 384001"

  // Format currency function
  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0)
    return `₹${num.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
  }

  // Check if full period is selected (wide date range)
  let displayFromDate = fromDate
  let displayToDate = toDate

  if (fromDate === '2000-01-01' || new Date(fromDate).getFullYear() < 2020) {
    displayFromDate = '2026-01-01' // Start of business year
  }
  if (toDate === '2099-12-31' || new Date(toDate).getFullYear() > 2030) {
    const today = new Date()
    displayToDate = today.toISOString().split('T')[0]
  }

  // Build transaction rows
  const transactionRows = transactions.map((item, idx) => {
    const dr = parseFloat(item.dr || 0)
    const cr = parseFloat(item.cr || 0)
    const balance = parseFloat(item.running_balance || item.balance || 0)
    
    // Handle multiline particulars - replace newlines with <br> for HTML
    const particularsFormatted = (item.particulars || '-').replace(/\n/g, '<br/>')

    return `
      <tr>
        <td style="border: 1px solid #000; padding: 10px 12px; font-size: 14px; text-align: center;">${idx + 1}</td>
        <td style="border: 1px solid #000; padding: 10px 12px; font-size: 14px;">${formatDateForPDF(item.date)}</td>
        <td style="border: 1px solid #000; padding: 10px 12px; font-size: 14px;">${item.account}</td>
        <td style="border: 1px solid #000; padding: 10px 12px; font-size: 14px; white-space: pre-wrap;">${particularsFormatted}</td>
        <td style="border: 1px solid #000; padding: 10px 12px; text-align: right; font-size: 14px;">
          ${dr > 0 ? formatCurrency(dr) : '-'}
        </td>
        <td style="border: 1px solid #000; padding: 10px 12px; text-align: right; font-size: 14px;">
          ${cr > 0 ? formatCurrency(cr) : '-'}
        </td>
        <td style="border: 1px solid #000; padding: 10px 12px; text-align: right; font-weight: bold; font-size: 14px;">
          ${formatCurrency(balance)}
        </td>
      </tr>
    `
  }).join('')

  // Calculate opening balance
  const openingBalance = totals.closingBalance - totals.totalDr + totals.totalCr

  // Create HTML content for PDF
  const htmlContent = `
    <div id="pdf-content" style="font-family: 'Arial', sans-serif; padding: 40px 50px; background: white; max-width: 1400px; margin: 0 auto;">
      <!-- Company Header -->
      <div style="position: relative; text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; min-height: 120px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">${companyName}</h1>
        <p style="margin: 8px 0 0 0; font-size: 16px; font-style: italic; letter-spacing: 0.5px;">SB lemoner</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; letter-spacing: 0.5px;">${companyAddress}</p>
        <p style="position: absolute; bottom: 5px; right: 0; margin: 0; font-size: 13px; font-weight: 600; letter-spacing: 0.3px;">Sachin B. Patel - 9904048755</p>
      </div>

      <!-- Document Title -->
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="margin: 0; font-size: 20px; font-weight: bold; text-decoration: underline;">LEDGER STATEMENT</h2>
      </div>

      <!-- Client and Period Information -->
      <div style="margin-bottom: 25px;">
        <table style="width: 100%; font-size: 15px;">
          <tr>
            <td style="padding: 6px 0;"><strong>Account Name:</strong> ${clientName || 'N/A'}</td>
            <td style="padding: 6px 0; text-align: right;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;"><strong>Period:</strong> ${formatDateForPDF(displayFromDate)} to ${formatDateForPDF(displayToDate)}</td>
            <td style="padding: 6px 0; text-align: right;"><strong>Opening Balance:</strong> ${formatCurrency(openingBalance)}</td>
          </tr>
        </table>
        <div style="border-bottom: 2px solid #000; margin-top: 10px;"></div>
      </div>

      <!-- Transaction Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
        <thead>
          <tr style="background: #fff; border: 2px solid #000;">
            <th style="border: 1px solid #000; padding: 12px 14px; text-align: center; font-weight: bold; font-size: 15px;">Sr. No.</th>
            <th style="border: 1px solid #000; padding: 12px 14px; text-align: left; font-weight: bold; font-size: 15px;">Date</th>
            <th style="border: 1px solid #000; padding: 12px 14px; text-align: left; font-weight: bold; font-size: 15px;">Account</th>
            <th style="border: 1px solid #000; padding: 12px 14px; text-align: left; font-weight: bold; font-size: 15px;">Particulars</th>
            <th style="border: 1px solid #000; padding: 12px 14px; text-align: right; font-weight: bold; font-size: 15px;">Debit (₹)</th>
            <th style="border: 1px solid #000; padding: 12px 14px; text-align: right; font-weight: bold; font-size: 15px;">Credit (₹)</th>
            <th style="border: 1px solid #000; padding: 12px 14px; text-align: right; font-weight: bold; font-size: 15px;">Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${transactionRows}
        </tbody>
      </table>

      <!-- Summary Section -->
      <div style="margin-top: 35px; border-top: 2px solid #000; padding-top: 20px;">
        <h3 style="margin: 0 0 18px 0; font-size: 16px; font-weight: bold;">ACCOUNT SUMMARY</h3>
        <table style="width: 100%; font-size: 15px;">
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #000; font-weight: bold; width: 30%;">Total Debit Amount:</td>
            <td style="padding: 10px 12px; border: 1px solid #000; text-align: right;">${formatCurrency(totals.totalDr)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #000; font-weight: bold;">Total Credit Amount:</td>
            <td style="padding: 10px 12px; border: 1px solid #000; text-align: right;">${formatCurrency(totals.totalCr)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #000; font-weight: bold;">Closing Balance:</td>
            <td style="padding: 10px 12px; border: 1px solid #000; text-align: right; font-weight: bold;">${formatCurrency(totals.closingBalance)}</td>
          </tr>
        </table>
      </div>


    </div>
  `

  // Create temporary element to render HTML
  const element = document.createElement('div')
  element.innerHTML = htmlContent
  element.style.position = 'absolute'
  element.style.left = '-9999px'
  element.style.width = '1200px'
  element.style.backgroundColor = 'white'
  document.body.appendChild(element)

  // Convert HTML to canvas and then to PDF
  html2canvas(element, { 
    scale: 2,
    backgroundColor: '#ffffff',
    allowTaint: true,
    useCORS: true
  }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    const imgWidth = 297 // A4 landscape width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    // Add pages as needed
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= 210 // A4 landscape height in mm

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= 210
    }

    // Download PDF
    const filename = `${clientName}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(filename)

    // Clean up
    document.body.removeChild(element)
  }).catch((err) => {
    console.error('PDF generation error:', err)
    document.body.removeChild(element)
    alert('Error generating PDF: ' + err.message)
  })
}
