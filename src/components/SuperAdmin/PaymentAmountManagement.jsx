import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import './PaymentAmountManagement.css'

// Sample data
const sampleStudents = [
  {
    id: 'STU001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    college: 'Supreme Knowledge Foundation',
    department: 'Computer Science',
    year: '3rd Year',
    registeredEvents: ['EVT001', 'EVT002'],
    customAmounts: {
      'EVT001': 500,
      'EVT002': 1000
    }
  },
  {
    id: 'STU002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    college: 'Supreme Knowledge Foundation',
    department: 'Electronics',
    year: '2nd Year',
    registeredEvents: ['EVT001'],
    customAmounts: {
      'EVT001': 500
    }
  }
]

const sampleEvents = [
  { id: 'EVT001', name: 'Coding Competition', baseAmount: 500 },
  { id: 'EVT002', name: 'Robo Wars', baseAmount: 1000 },
  { id: 'EVT003', name: 'Cultural Night', baseAmount: 300 }
]

const PaymentAmountManagement = () => {
  const [students, setStudents] = useState(sampleStudents)
  const [events] = useState(sampleEvents)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [editingAmount, setEditingAmount] = useState({})
  const [showEditModal, setShowEditModal] = useState(false)

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditAmounts = (student) => {
    setSelectedStudent(student)
    setEditingAmount(student.customAmounts || {})
    setShowEditModal(true)
  }

  const handleAmountChange = (eventId, amount) => {
    setEditingAmount(prev => ({
      ...prev,
      [eventId]: parseFloat(amount) || 0
    }))
  }

  const handleSaveAmounts = () => {
    setStudents(students.map(student =>
      student.id === selectedStudent.id
        ? { ...student, customAmounts: editingAmount }
        : student
    ))
    setShowEditModal(false)
    setSelectedStudent(null)
  }

  const getTotalAmount = (student) => {
    return student.registeredEvents.reduce((total, eventId) => {
      return total + (student.customAmounts[eventId] || 0)
    }, 0)
  }

  const handleBulkUpdate = () => {
    // You can implement bulk update functionality here
    alert('Bulk update feature coming soon!')
  }

  return (
    <div className="payment-amount-management">
      {/* Header */}
      <div className="section-header">
        <div className="header-content">
          <h2>Payment Amount Management</h2>
          <p>Set custom payment amounts for individual students</p>
        </div>
        <button className="bulk-btn interactive" onClick={handleBulkUpdate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Bulk Update
        </button>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Year</th>
              <th>Registered Events</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="student-id">{student.id}</td>
                <td>
                  <div className="student-info">
                    <span className="student-name">{student.name}</span>
                    <span className="student-email">{student.email}</span>
                  </div>
                </td>
                <td>{student.department}</td>
                <td>{student.year}</td>
                <td>
                  <span className="event-count">{student.registeredEvents.length} events</span>
                </td>
                <td className="amount">₹{getTotalAmount(student)}</td>
                <td>
                  <button
                    className="edit-amount-btn"
                    onClick={() => handleEditAmounts(student)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Amounts
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="no-results">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <p>No students found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedStudent && createPortal(
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <motion.div
            className="amount-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Edit Payment Amounts</h2>
                <p className="student-details">
                  {selectedStudent.name} ({selectedStudent.id})
                </p>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="student-event-list">
                {selectedStudent.registeredEvents.map(eventId => {
                  const event = events.find(e => e.id === eventId)
                  if (!event) return null

                  return (
                    <div key={eventId} className="event-amount-item">
                      <div className="event-info">
                        <h4>{event.name}</h4>
                        <span className="base-amount">Base: ₹{event.baseAmount}</span>
                      </div>
                      <div className="amount-input-group">
                        <span className="currency">₹</span>
                        <input
                          type="number"
                          value={editingAmount[eventId] || event.baseAmount}
                          onChange={(e) => handleAmountChange(eventId, e.target.value)}
                          min="0"
                          step="50"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="modal-summary">
                <div className="summary-item">
                  <span>Total Events:</span>
                  <strong>{selectedStudent.registeredEvents.length}</strong>
                </div>
                <div className="summary-item total">
                  <span>Total Amount:</span>
                  <strong>
                    ₹{selectedStudent.registeredEvents.reduce((total, eventId) => 
                      total + (editingAmount[eventId] || 0), 0
                    )}
                  </strong>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button className="btn-save" onClick={handleSaveAmounts}>
                  Save Changes
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

export default PaymentAmountManagement
