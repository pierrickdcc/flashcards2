
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlashcard } from './context/FlashcardContext';
import Auth from './components/Auth';
import Header from './components/Header';
import DeleteSubjectModal from './components/DeleteSubjectModal';
import Stats from './components/Stats';
import Actions from './components/Actions';
import Filters from './components/Filters';
import CardGrid from './components/CardGrid';
import CardTable from './components/CardTable';
import ReviewMode from './components/ReviewMode';
import ConfigModal from './components/ConfigModal';
import BulkAddModal from './components/BulkAddModal';
import AddSubjectModal from './components/AddSubjectModal';
import AddCardModal from './components/AddCardModal';
import AddCourseModal from './components/AddCourseModal';
import Dashboard from './components/Dashboard';
import CourseViewer from './components/CourseViewer';
import CourseList from './components/CourseList';
import SignOutConfirmationModal from './components/SignOutConfirmationModal';
import { Toaster } from 'react-hot-toast';
import { DEFAULT_SUBJECT } from './constants/app';

const FlashcardsPWA = () => {
  const {
    session,
    cards,
    subjects,
    courses,
    reviewCard,
    deleteCardWithSync,
    updateCardWithSync,
    handleDeleteCardsOfSubject,
    handleReassignCardsOfSubject,
    signOut,
    showConfigModal,
    showAddCardModal,
    showAddCourseModal,
    showAddSubjectModal,
    showBulkAddModal,
    showDeleteSubjectModal,
    showSignOutModal,
    toggleConfigModal,
    toggleAddCardModal,
    toggleAddCourseModal,
    toggleAddSubjectModal,
    toggleBulkAddModal,
    toggleDeleteSubjectModal,
    toggleSignOutModal,
    showReviewMode,
    setShowReviewMode,
    cardsToReview,
    searchTerm
  } = useFlashcard();

  // --- LOCAL UI STATE ---
  const [view, setView] = useState('courses');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [editingCard, setEditingCard] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      const views = ['courses', 'cards', 'table', 'dashboard'];
      const currentIndex = views.indexOf(view);
      const nextIndex = (currentIndex + 1) % views.length;
      setView(views[nextIndex]);
    }
    if (isRightSwipe) {
      const views = ['courses', 'cards', 'table', 'dashboard'];
      const currentIndex = views.indexOf(view);
      const prevIndex = currentIndex === 0 ? views.length - 1 : currentIndex - 1;
      setView(views[prevIndex]);
    }
  };

  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleDeleteSubject = (subjectName) => {
    setSubjectToDelete(subjectName);
    toggleDeleteSubjectModal();
  };

  const confirmDeleteSubject = () => {
    handleDeleteCardsOfSubject(subjectToDelete);
    toggleDeleteSubjectModal();
    setSubjectToDelete(null);
    setSelectedSubject('all');
  };

  const confirmReassignSubject = () => {
    handleReassignCardsOfSubject(subjectToDelete);
    toggleDeleteSubjectModal();
    setSubjectToDelete(null);
    setSelectedSubject(DEFAULT_SUBJECT);
  };

  const filteredCards = useMemo(() => {
    if (!cards?.length) return [];

    const term = searchTerm?.toLowerCase().trim();
    return cards.filter(c => {
      const matchesSubject = selectedSubject === 'all' || c.subject === selectedSubject;
      if (!matchesSubject) return false;

      if (!term) return true;
      const q = c.question.toLowerCase();
      const a = c.answer.toLowerCase();
      return q.includes(term) || a.includes(term);
    });
  }, [cards, selectedSubject, searchTerm]);

  const stats = {
    total: cards?.length || 0,
    toReview: cardsToReview.length,
    subjects: subjects?.length || 0
  };

  if (!session) {
    return <Auth />;
  }

  if (selectedCourse) {
    return (
      <CourseViewer
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    );
  }

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Toaster />
      <Header />

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <Stats stats={stats} />
        
        <Actions
          startReview={() => setShowReviewMode(true)}
          cardsToReviewCount={cardsToReview.length}
        />
        
        <Filters
          view={view}
          setView={setView}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          subjects={subjects || []}
          onDeleteSubject={handleDeleteSubject}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'courses' && (
              <CourseList
                onCourseSelect={setSelectedCourse}
              />
            )}
            {view === 'cards' && (
              <CardGrid
                filteredCards={filteredCards}
                setEditingCard={setEditingCard}
                deleteCardWithSync={deleteCardWithSync}
              />
            )}
            {view === 'table' && (
              <CardTable
                filteredCards={filteredCards}
                editingCard={editingCard}
                setEditingCard={setEditingCard}
                updateCardWithSync={updateCardWithSync}
                deleteCardWithSync={deleteCardWithSync}
                subjects={subjects || []}
              />
            )}
            {view === 'dashboard' && (
              <Dashboard />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <ConfigModal
        show={showConfigModal}
        onClose={toggleConfigModal}
      />
      
      <BulkAddModal
        show={showBulkAddModal}
        onClose={toggleBulkAddModal}
      />
      
      <AddSubjectModal
        show={showAddSubjectModal}
        onClose={toggleAddSubjectModal}
      />

      <AddCardModal
        show={showAddCardModal}
        onClose={toggleAddCardModal}
      />

      <AddCourseModal
        show={showAddCourseModal}
        onClose={toggleAddCourseModal}
      />

      <DeleteSubjectModal
        show={showDeleteSubjectModal}
        onClose={toggleDeleteSubjectModal}
        onDelete={confirmDeleteSubject}
        onReassign={confirmReassignSubject}
        subjectToDelete={subjectToDelete}
      />

      <SignOutConfirmationModal
        show={showSignOutModal}
        onClose={toggleSignOutModal}
        onConfirm={handleSignOut}
      />
    </div>
  );
};

export default FlashcardsPWA;
