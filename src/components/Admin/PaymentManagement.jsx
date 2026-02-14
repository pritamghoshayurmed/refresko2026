import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import './PaymentManagement.css'

const normalizePayments = (records) => {
  if (!Array.isArray(records)) return []

  return records.map((payment, index) => ({
    id: payment.id || `PAY${index + 1}`,
    utrNo: payment.utrNo || payment.paymentUTR || payment.transactionId || 'N/A',
    studentCode: payment.studentCode || payment.studentId || 'N/A',
    studentName: payment.studentName || payment.name || 'N/A',
    email: payment.email || 'N/A',
    college: payment.college || 'N/A',
    department: payment.department || 'N/A',
    year: payment.year || 'N/A',
    event: payment.event || 'Refresko 2026 Registration',
    amount: Number(payment.amount) || 500,
    status: payment.status || 'pending',
    date: payment.date || new Date().toISOString(),
    transactionId: payment.transactionId || 'N/A',
    paymentMethod: payment.paymentMethod || 'UPI',
    screenshot: payment.screenshot || payment.paymentScreenshot || null,
    screenshotName: payment.screenshotName || payment.paymentScreenshotName || ''
  }))
}

const loadPaymentsFromLocalStorage = () => {
  try {
    const savedPayments = localStorage.getItem('paymentSubmissions')
    const parsedPayments = savedPayments ? JSON.parse(savedPayments) : []
    const normalized = normalizePayments(parsedPayments)

    if (normalized.length > 0) {
      return normalized
    }

    const legacyUtr = localStorage.getItem('paymentUTR')
    const legacyTxnId = localStorage.getItem('transactionId')
    const legacyStudentProfile = localStorage.getItem('studentProfile')

    if (!legacyUtr && !legacyTxnId) {
      return []
    }

    let parsedProfile = {}
    try {
      parsedProfile = legacyStudentProfile ? JSON.parse(legacyStudentProfile) : {}
    } catch {
      parsedProfile = {}
    }

    return normalizePayments([
      {
        id: `PAY${Date.now()}`,
        utrNo: legacyUtr || legacyTxnId || 'N/A',
        studentCode: parsedProfile.studentId || 'N/A',
        studentName: parsedProfile.name || 'N/A',
        email: parsedProfile.email || 'N/A',
        department: parsedProfile.department || 'N/A',
        year: parsedProfile.year || 'N/A',
        amount: 500,
        status: 'pending',
        date: new Date().toISOString(),
        transactionId: legacyTxnId || 'N/A',
        paymentMethod: 'UPI',
        screenshotName: localStorage.getItem('paymentScreenshotName') || ''
      }
    ])
  } catch {
    return []
  }
}

const PaymentManagement = () => {
  const [payments, setPayments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedPayment, setSelectedPayment] = useState(null)

  useEffect(() => {
    const refreshPayments = () => {
      setPayments(loadPaymentsFromLocalStorage())
    }

    refreshPayments()

    const handleStorageUpdate = (event) => {
      if (event.key === 'paymentSubmissions') {
        refreshPayments()
      }
    }

    window.addEventListener('storage', handleStorageUpdate)
    window.addEventListener('paymentSubmissionsUpdated', refreshPayments)

    return () => {
      window.removeEventListener('storage', handleStorageUpdate)
      window.removeEventListener('paymentSubmissionsUpdated', refreshPayments)
    }
  }, [])

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.utrNo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment)
  }

  const handleDownloadReceipt = (payment) => {
    // Implement receipt download logic
    console.log('Downloading receipt for:', payment.id)
  }

  return (
    <div className="payment-management">
      {/* Summary Cards */}
      <div className="summary-cards">
        <motion.div
          className="summary-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-icon revenue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="card-content">
            <h3>Total Revenue</h3>
            <p className="card-value">₹{totalRevenue.toLocaleString()}</p>
            <span className="card-label">Completed Payments</span>
          </div>
        </motion.div>

        <motion.div
          className="summary-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="card-icon pending">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="card-content">
            <h3>Pending Amount</h3>
            <p className="card-value">₹{pendingAmount.toLocaleString()}</p>
            <span className="card-label">Awaiting Confirmation</span>
          </div>
        </motion.div>

        <motion.div
          className="summary-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card-icon total">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <div className="card-content">
            <h3>Total Registrations</h3>
            <p className="card-value">{payments.length}</p>
            <span className="card-label">All Participants</span>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        className="payment-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by transaction ID, student code, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({payments.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed ({payments.filter(p => p.status === 'completed').length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({payments.filter(p => p.status === 'pending').length})
          </button>
        </div>
      </motion.div>

      {/* Payment Table */}
      <motion.div
        className="payment-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <table className="payment-table">
          <thead>
            <tr>
              <th>UTR No.</th>
              <th>Student Code</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Year</th>
              <th>Amount</th>
              <th>Date &amp; Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment, index) => (
              <motion.tr
                key={payment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="payment-id">{payment.utrNo}</td>
                <td>{payment.studentCode}</td>
                <td className="student-name">{payment.studentName}</td>
                <td>{payment.department}</td>
                <td>{payment.year}</td>
                <td className="amount">₹{payment.amount}</td>
                <td>{new Date(payment.date).toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn view"
                      onClick={() => handleViewReceipt(payment)}
                      title="View Receipt"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button
                      className="action-btn download"
                      onClick={() => handleDownloadReceipt(payment)}
                      title="Download Receipt"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="no-results">
            <p>No payments found matching your search criteria.</p>
          </div>
        )}
      </motion.div>

      {/* Receipt Modal */}
      {selectedPayment && createPortal(
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <motion.div
            className="receipt-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="receipt-header">
              <h2>Payment Receipt</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedPayment(null)}
              >
                ×
              </button>
            </div>

            <div className="receipt-content">
              <div className="receipt-logo">
                <span className="logo-main">REFRESKO</span>
                <span className="logo-year">2026</span>
              </div>

              <div className="receipt-details">
                <div className="detail-row">
                  <span className="label">Payment ID:</span>
                  <span className="value">{selectedPayment.id}</span>
                </div>
                <div className="detail-row">
                  <span className="label">UTR No:</span>
                  <span className="value">{selectedPayment.utrNo}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Student Name:</span>
                  <span className="value">{selectedPayment.studentName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedPayment.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">College:</span>
                  <span className="value">{selectedPayment.college}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Department:</span>
                  <span className="value">{selectedPayment.department}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Year:</span>
                  <span className="value">{selectedPayment.year}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Event:</span>
                  <span className="value">{selectedPayment.event}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment Method:</span>
                  <span className="value">{selectedPayment.paymentMethod}</span>
                </div>
                {selectedPayment.screenshot && (
                  <div className="detail-row">
                    <span className="label">Screenshot:</span>
                    <span className="value">{selectedPayment.screenshotName || 'Uploaded'}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(selectedPayment.date).toLocaleString()}</span>
                </div>
                <div className="detail-row highlight">
                  <span className="label">Amount Paid:</span>
                  <span className="value amount-paid">₹{selectedPayment.amount}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className={`status-badge ${selectedPayment.status}`}>
                    {selectedPayment.status}
                  </span>
                </div>
              </div>

              <div className="receipt-footer">
                <p>Thank you for participating in Refresko 2026!</p>
                <button
                  className="download-receipt-btn"
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default PaymentManagement
