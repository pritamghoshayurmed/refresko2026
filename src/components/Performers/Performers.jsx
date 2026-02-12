import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import './Performers.css'

const performers = [
  {
    id: 1,
    name: 'ARIJIT SINGH',
    role: 'Playback Singer',
    year: '2011',
    image: '/arijitsingh2011.jpg'
  },
  {
    id: 2,
    name: 'ASH KING',
    role: 'Playback Singer',
    year: '2023',
    image: '/ashking2023.jpg'
  },
  {
    id: 3,
    name: 'SNIGDHAJIT BHOWMIK',
    role: 'Performer',
    year: '2024',
    image: '/snigdhajitbhowmik2024.jpg'
  },
  {
    id: 4,
    name: 'NANDY SISTERS',
    role: 'Musical Duo',
    year: '2025',
    image: '/nandysisters2025.jpg'
  }
]

const Performers = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [activePerformer, setActivePerformer] = useState(0)

  useEffect(() => {
    // Cycle through performers every 2 seconds
    const interval = setInterval(() => {
      setActivePerformer((prev) => (prev + 1) % performers.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="performers" ref={sectionRef} className="performers">
      <div className="performers-header">
        <motion.span
          className="performers-label"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          PAST
        </motion.span>
        <motion.h2
          className="performers-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          PERFORMERS
        </motion.h2>
      </div>

      <div className="performers-track-wrapper">
        <div className="dotted-path">
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path
              d="M0,100 Q300,20 600,100 T1200,100"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeDasharray="8,8"
              fill="none"
            />
          </svg>
        </div>

        <div className="performers-scroll">
          <div className="performers-grid">
            {performers.map((performer, index) => (
              <motion.div
                key={performer.id}
                className={`performer-card interactive ${activePerformer === index ? 'active' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="performer-year-badge">{performer.year}</div>
                <div className="performer-image-wrapper">
                  <img
                    src={performer.image}
                    alt={performer.name}
                    className="performer-image"
                  />
                  <div className="performer-overlay">
                    <div className="performer-info">
                      <h3 className="performer-name">{performer.name}</h3>
                      <p className="performer-role">{performer.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="performers-indicator">
        <span className="indicator-text">Refresko 2026</span>
      </div>
    </section>
  )
}

export default Performers
