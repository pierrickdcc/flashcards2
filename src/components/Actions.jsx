import React from 'react';
import { Brain, Plus, FolderPlus, FilePlus, BookPlus } from 'lucide-react';
import styles from './Actions.module.css';

import { useFlashcard } from '../context/FlashcardContext';

const Actions = ({ startReview, cardsToReviewCount }) => {
  const {
    toggleBulkAddModal,
    toggleAddSubjectModal,
    toggleAddCardModal,
    toggleAddCourseModal,
  } = useFlashcard();

  return (
    <div className={styles.actionsContainer}>
      <button
        onClick={startReview}
        disabled={cardsToReviewCount === 0}
        title={cardsToReviewCount === 0 ? "Aucune carte à réviser" : ""}
        className={`${styles.button} ${styles.reviewButton}`}
      >
        <Brain size={20} /> Réviser ({cardsToReviewCount})
      </button>
      
      <button
        onClick={toggleAddCardModal}
        className={`${styles.button} ${styles.secondaryButton}`}
      >
        <FilePlus size={20} /> Ajouter une carte
      </button>

      <button
        onClick={toggleAddCourseModal}
        className={`${styles.button} ${styles.secondaryButton}`}
      >
        <BookPlus size={20} /> Ajouter un cours
      </button>

      <button
        onClick={toggleBulkAddModal}
        className={`${styles.button} ${styles.secondaryButton}`}
      >
        <Plus size={20} /> Ajout en masse
      </button>

      <button
        onClick={toggleAddSubjectModal}
        className={`${styles.button} ${styles.secondaryButton}`}
      >
        <FolderPlus size={20} /> Matière
      </button>
    </div>
  );
};

export default Actions;
