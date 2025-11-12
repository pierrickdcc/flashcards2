import React from 'react';
import { useFlashcard } from '../context/FlashcardContext';
import styles from './CourseList.module.css';
import { motion } from 'framer-motion';

/**
 * @param {{
 *   onCourseSelect: (course: object) => void
 * }} props
 */
const CourseList = ({ onCourseSelect }) => {
  const { courses, subjects } = useFlashcards();

  if (!subjects || !courses) {
    return <div>Chargement...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {(subjects || []).map(subject => {
        const subjectCourses = (courses || []).filter(c => c.subject === subject.name);
        if (subjectCourses.length === 0) return null;

        return (
          <div key={subject.id || subject.name} className={styles.subjectSection}>
            <h2 className={styles.subjectTitle}>{subject.name}</h2>
            <div className={styles.courseGrid}>
              {subjectCourses.map(course => (
                <motion.button
                  key={course.id}
                  className={styles.courseCard}
                  onClick={() => onCourseSelect(course)}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {course.title}
                </motion.button>
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default CourseList;
