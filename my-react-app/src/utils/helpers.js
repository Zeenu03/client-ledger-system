// Format currency with INR symbol
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Format amount with Indian number format (e.g., 1,50,000.00)
export const formatAmount = (amount) => {
  const num = parseFloat(amount || 0)
  return num.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})
}

// Format date as dd-Month Name-yyyy
export const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
  const month = monthNames[d.getMonth()]
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

// Calculate running balance
export const calculateRunningBalance = (transactions, initialBalance = 0) => {
  let balance = initialBalance
  return transactions.map((trans) => {
    balance += (trans.dr || 0) - (trans.cr || 0)
    return { ...trans, balance }
  })
}

// Export to CSV
export const exportToCSV = (data, filename = 'export.csv') => {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map((row) => Object.values(row).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate phone
export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/
  return re.test(phone)
}
