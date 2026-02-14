import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import './StudentManagement.css'

// Sample students data
const sampleStudentsData = [
  {
    id: 'STU001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    college: 'Supreme Knowledge Foundation',
    department: 'Computer Science',
    year: '3rd Year',
    rollNumber: 'CS2021001',
    registeredEvents: ['EVT001', 'EVT002'],
    status: 'active',
    lastLogin: '2026-02-10 14:30'
  },
  {
    id: 'STU002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43211',
    college: 'Supreme Knowledge Foundation',
    department: 'Electronics',
    year: '2nd Year',
    rollNumber: 'EC2022015',
    registeredEvents: ['EVT001'],
    status: 'active',
    lastLogin: '2026-02-11 09:15'
  },
  {
    id: 'STU003',
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    phone: '+91 98765 43212',
    college: 'Supreme Knowledge Foundation',
    department: 'Mechanical',
    year: '1st Year',
    rollNumber: 'ME2023042',
    registeredEvents: [],
    status: 'inactive',
    lastLogin: '2026-01-28 11:20'
  }
]

const StudentManagement = () => {
  const [students, setStudents] = useState(sampleStudentsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({})

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleEditStudent = (student) => {
    setSelectedStudent(student)
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      year: student.year,
      rollNumber: student.rollNumber
    })
    setShowEditModal(true)
  }

  const handleViewDetails = (student) => {
    setSelectedStudent(student)
    setShowDetailsModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStudents(students.map(student =>
      student.id === selectedStudent.id
        ? { ...student, ...formData }
        : student
    ))
    setShowEditModal(false)
    setSelectedStudent(null)
  }

  const handleToggleStatus = (studentId) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, status: student.status === 'active' ? 'inactive' : 'active' }
        : student
    ))
  }

  const handleResetPassword = (student) => {
    // In real implementation, this would send a password reset email
    alert(`Password reset link sent to ${student.email}`)
  }

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student account? This action cannot be undone.')) {
      setStudents(students.filter(student => student.id !== studentId))
    }
  }

  return (
    <div className="student-management">
      {/* Header */}
      <div className="section-header">
        <div className="header-content">
          <h2>Student Account Management</h2>
          <p>Manage student login credentials and account details</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, ID, or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filters">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({students.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Active ({students.filter(s => s.status === 'active').length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilterStatus('inactive')}
          >
            Inactive ({students.filter(s => s.status === 'inactive').length})
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="student-id-cell">{student.id}</td>
                <td className="student-name-cell">{student.name}</td>
                <td>{student.email}</td>
                <td>{student.department}</td>
                <td>{student.year}</td>
                <td>
                  <span className={`status-badge ${student.status}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <div className="student-actions compact">
                    <button
                      className="action-btn view"
                      onClick={() => handleViewDetails(student)}
                    >
                      View Full Details
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditStudent(student)}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="no-results">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <p>No students found</p>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedStudent && createPortal(
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <motion.div
            className="edit-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Student Full Details</h2>
              <button
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>

            <div className="edit-form">
              <div className="student-full-details">
                <div className="full-detail-row"><span>ID</span><strong>{selectedStudent.id}</strong></div>
                <div className="full-detail-row"><span>Name</span><strong>{selectedStudent.name}</strong></div>
                <div className="full-detail-row"><span>Email</span><strong>{selectedStudent.email}</strong></div>
                <div className="full-detail-row"><span>Phone</span><strong>{selectedStudent.phone}</strong></div>
                <div className="full-detail-row"><span>College</span><strong>{selectedStudent.college}</strong></div>
                <div className="full-detail-row"><span>Department</span><strong>{selectedStudent.department}</strong></div>
                <div className="full-detail-row"><span>Year</span><strong>{selectedStudent.year}</strong></div>
                <div className="full-detail-row"><span>Roll Number</span><strong>{selectedStudent.rollNumber}</strong></div>
                <div className="full-detail-row"><span>Registered Events</span><strong>{selectedStudent.registeredEvents.length}</strong></div>
                <div className="full-detail-row"><span>Last Login</span><strong>{selectedStudent.lastLogin}</strong></div>
                <div className="full-detail-row"><span>Status</span><strong>{selectedStudent.status}</strong></div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowDetailsModal(false)}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn-submit"
                  onClick={() => {
                    setShowDetailsModal(false)
                    handleEditStudent(selectedStudent)
                  }}
                >
                  Edit Student
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Edit Modal */}
      {showEditModal && selectedStudent && createPortal(
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <motion.div
            className="edit-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Edit Student Details</h2>
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>

            <form className="edit-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Roll Number *</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default StudentManagement
