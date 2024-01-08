import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Note from "./assets/components/Note";
import NoteForm from "./assets/components/NoteForm";
import * as noteService from "./assets/services/noteService";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [showArchivedNotes, setShowArchivedNotes] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await noteService.getNotes();
        setNotes(response.data);
      } catch (error) {
        console.error("Error al cargar notas:", error);
      }
    };

    fetchNotes();
  }, []);

  const deleteAllNotes = async () => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar todas las notas?")
    ) {
      try {
        await Promise.all(
          notes.map((note) => noteService.deleteNote(note.noteId))
        );
        setNotes([]);
        await Promise.all(
          archivedNotes.map((note) => noteService.deleteNote(note.noteId))
        );
        setArchivedNotes([]);
      } catch (error) {
        console.error("Error al eliminar notas:", error);
      }
    }
  };

  const toggleNoteSelection = (noteId) => {
    setSelectedNotes(
      selectedNotes.includes(noteId)
        ? selectedNotes.filter((id) => id !== noteId)
        : [...selectedNotes, noteId]
    );
  };

  const toggleArchivedNotes = () => {
    setShowArchivedNotes(!showArchivedNotes);
  };

  const deleteNote = async (noteId, isArchived = false) => {
    console.log("Note ID to delete:", noteId);
    if (typeof noteId === "undefined") {
      console.error("Error: noteId is undefined");
      return;
    }
    try {
      await noteService.deleteNote(noteId);

      if (isArchived) {
        setArchivedNotes(
          archivedNotes.filter((note) => note.noteId !== noteId)
        );
      } else {
        setNotes(notes.filter((note) => note.noteId !== noteId));
      }
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
    }
  };

  const deleteSelectedNotes = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar las notas seleccionadas?"
      )
    ) {
      try {
        await Promise.all(
          selectedNotes.map((noteId) => noteService.deleteNote(noteId))
        );

        setNotes(notes.filter((note) => !selectedNotes.includes(note.noteId)));
        setArchivedNotes(
          archivedNotes.filter((note) => !selectedNotes.includes(note.noteId))
        );

        setSelectedNotes([]);
      } catch (error) {
        console.error("Error al eliminar notas seleccionadas:", error);
      }
    }
  };

  const addOrUpdateNote = (savedNote, isUpdated) => {
    if (isUpdated) {
      setNotes(
        notes.map((note) =>
          note.noteId === savedNote.noteId ? savedNote : note
        )
      );

      if (archivedNotes.some((note) => note.noteId === savedNote.noteId)) {
        setArchivedNotes(
          archivedNotes.map((note) =>
            note.noteId === savedNote.noteId ? savedNote : note
          )
        );
      }
    } else {
      setNotes([...notes, savedNote]);
    }
    setEditingNote(null); 
  };

  const selectNoteToEdit = (note) => {
    setEditingNote(note);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelectedCategories) => {
      const newCategories = new Set(prevSelectedCategories);
      if (newCategories.has(category)) {
        newCategories.delete(category);
      } else {
        newCategories.add(category);
      }
      return newCategories;
    });
  };

  const archiveNote = async (noteId) => {
    try {
      const noteToArchive = notes.find((note) => note.noteId === noteId);
      if (noteToArchive) {
        await noteService.updateNote(noteId, {
          ...noteToArchive,
          isArchived: true,
          categories: noteToArchive.categories.map(
            (category) => category.categoryId
          ),
        });
        setNotes(notes.filter((note) => note.noteId !== noteId));
        setArchivedNotes([
          ...archivedNotes,
          { ...noteToArchive, isArchived: true },
        ]);
      }
    } catch (error) {
      console.error("Error al archivar la nota:", error);
    }
  };

  const unarchiveNote = async (noteId) => {
    try {
      const noteToUnarchive = archivedNotes.find(
        (note) => note.noteId === noteId
      );
      if (noteToUnarchive) {
        // Actualiza el estado isArchived en el backend
        await noteService.updateNote(noteId, {
          ...noteToUnarchive,
          isArchived: false,
          categories: noteToUnarchive.categories.map(
            (category) => category.categoryId
          ),
        });
        setArchivedNotes(
          archivedNotes.filter((note) => note.noteId !== noteId)
        );
        setNotes([...notes, { ...noteToUnarchive, isArchived: false }]);
      }
    } catch (error) {
      console.error("Error al desarchivar la nota:", error);
    }
  };

  const filterNotes = (notes) => {
    return notes.filter((note) => {
      const matchesSearch =
        search === "" ||
        note.title.toLowerCase().includes(search) ||
        note.content.toLowerCase().includes(search);
      const matchesCategories =
        selectedCategories.size === 0 ||
        note.categories
          .map((c) => c.name)
          .some((category) => selectedCategories.has(category));
      return matchesSearch && matchesCategories;
    });
  };

  const filteredActiveNotes = filterNotes(notes);
  const filteredArchivedNotes = filterNotes(archivedNotes);

  return (
    <div className="container bg-color my-5 p-3 rounded">
      <h1 className="text-center">Notes App</h1>
      <NoteForm addOrUpdateNote={addOrUpdateNote} editingNote={editingNote} />

      <div className="my-5">
        <h3>Filtrar Notas por Categoría</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["trabajo", "estudio", "medicos", "recreacion", "otros"].map(
            (category) => (
              <label key={category} className="me-2">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={selectedCategories.has(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="me-1"
                />
                {category}
              </label>
            )
          )}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          className="form-control mt-2"
          placeholder="🔍 Buscar en título y contenido..."
        />
      </div>

      <div>
        <button onClick={deleteAllNotes} className="btn btn-danger">
          Eliminar todas las notas
        </button>
        <button onClick={deleteSelectedNotes} className="btn btn-warning ms-2">
          Eliminar notas seleccionadas
        </button>
      </div>

      <div className="mt-4">
        <h2>Notas Activas</h2>
        <div
          className="notes-container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "start",
          }}
        >
          {filteredActiveNotes.length > 0 ? (
            filteredActiveNotes.map((note, index) => (
              <Note
                key={index}
                note={note}
                onEdit={selectNoteToEdit}
                onDelete={deleteNote}
                onToggleSelect={toggleNoteSelection}
                isSelected={selectedNotes.includes(note.noteId)}
                onArchive={archiveNote}
                isArchived={false}
              />
            ))
          ) : (
            <p>No hay notas activas.</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h2>Notas Archivadas</h2>
        {archivedNotes.length > 0 && (
          <>
            <button onClick={toggleArchivedNotes} className="btn btn-info mb-3">
              {showArchivedNotes
                ? "Esconder Notas Archivadas"
                : "Mostrar Notas Archivadas"}
            </button>
            <div
              className="notes-container"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "start",
              }}
            >
              {showArchivedNotes &&
                filteredArchivedNotes.map((note, index) => (
                  <Note
                    key={index}
                    note={note}
                    onEdit={selectNoteToEdit}
                    onDelete={() => deleteNote(note.noteId, true)}
                    onToggleSelect={toggleNoteSelection}
                    isSelected={selectedNotes.includes(note.noteId)}
                    onUnarchive={unarchiveNote}
                    isArchived={true}
                  />
                ))}
            </div>
          </>
        )}
        {archivedNotes.length === 0 && <p>No hay notas archivadas.</p>}
      </div>
    </div>
  );
}

export default App;
