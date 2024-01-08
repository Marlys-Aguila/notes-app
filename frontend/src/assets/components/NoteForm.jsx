import React, { useState, useEffect, useRef } from "react";
import * as noteService from "../services/noteService";
import * as categoryService from "../services/categoryService";

function NoteForm({ editingNote, addOrUpdateNote }) {
  const [note, setNote] = useState({
    title: "",
    content: "",
    categories: [],
    id: null,
  });
  const [allCategories, setAllCategories] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const titleInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setAllCategories(response.data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    fetchCategories();

    if (editingNote) {
      setNote({
        title: editingNote.title,
        content: editingNote.content,
        categories: editingNote.categories.map(
          (category) => category.categoryId
        ),
        noteId: editingNote.noteId,
        isArchived: editingNote.isArchived,
      });
    }
  }, [editingNote]);

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value, 10);
    const newCategories = note.categories.includes(categoryId)
      ? note.categories.filter((id) => id !== categoryId)
      : [...note.categories, categoryId];

    setNote((prevNote) => ({
      ...prevNote,
      categories: newCategories,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (note.title && note.content && note.categories.length > 0) {
      try {
        let savedNote;
        const isUpdate = !!note.noteId;
        if (isUpdate) {
          savedNote = await noteService.updateNote(note.noteId, note);
        } else {
          savedNote = await noteService.createNote(note);
        }
        addOrUpdateNote(savedNote, isUpdate);
        setNote({ title: "", content: "", categories: [], id: null });
      } catch (error) {
        console.error("Error al guardar la nota:", error);
      }
      setSubmitted(false);
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }
  };

  const getValidationClass = (fieldValue) =>
    submitted && !fieldValue ? "is-invalid" : "";

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="noteTitle" className="form-label fw-bold fs-4">
          Título
        </label>
        <input
          ref={titleInputRef}
          type="text"
          className={`form-control ${getValidationClass(note.title)}`}
          id="noteTitle"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />
        {submitted && !note.title && (
          <div className="invalid-feedback">El título es obligatorio.</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="noteContent" className="form-label fw-bold fs-4">
          Contenido
        </label>
        <textarea
          className={`form-control ${getValidationClass(note.content)}`}
          id="noteContent"
          rows="3"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
        ></textarea>
        {submitted && !note.content && (
          <div className="invalid-feedback">El contenido es obligatorio.</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold fs-4">Categorías</label>
        <div>
          {allCategories.map((category) => (
            <label key={category.categoryId} className="d-inline-block me-3">
              <input
                type="checkbox"
                id={`category-${category.categoryId}`}
                value={category.categoryId}
                checked={note.categories.includes(category.categoryId)}
                onChange={handleCategoryChange}
                className="me-1"
              />
              {category.name}
            </label>
          ))}
        </div>
        {submitted && note.categories.length === 0 && (
          <div className="invalid-feedback d-block">
            Seleccione al menos una categoría.
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar Nota
      </button>
    </form>
  );
}

export default NoteForm;
