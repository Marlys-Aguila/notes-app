import "./Note.css";

function Note({
  note,
  onEdit,
  onDelete,
  onToggleSelect,
  isSelected,
  onArchive,
  onUnarchive,
  isArchived,
}) {
  const categoryNames = note.categories
    ? note.categories.map((cat) => cat.name).join(", ")
    : "";

  return (
    <div className="card card-note mb-2">
      <div className="card-body">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(note.noteId)}
          className="me-2"
        />
        <h5 className="card-title">{note.title}</h5>
        <p className="card-text">{note.content}</p>
        <p className="card-text">Categorías: {categoryNames}</p>
        <button className="btn btn-primary me-2" onClick={() => onEdit(note)}>
          Ver/Editar
        </button>
        <button
          className="btn btn-danger me-2"
          onClick={() => onDelete(note.noteId)}
        >
          Eliminar
        </button>
        {!isArchived ? (
          <button
            className="btn btn-secondary"
            onClick={() => {
              console.log("Deleting note:", note); 
              onArchive(note.noteId);
            }}
          >
            Archivar
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => onUnarchive(note.noteId)}
          >
            Desarchivar
          </button>
        )}
      </div>
    </div>
  );
}

export default Note;
