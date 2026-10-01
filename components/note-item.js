export default function NoteItem({ index, note, onDelete, onEdit }) {
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(note.updatedAt));

  return (
    <article className={`note-card note-card-${index % 3}`}>
      <div className="note-card-topline">
        <span className="note-date">{date}</span>
        <span className="note-pin" aria-hidden="true" />
      </div>
      <h3>{note.title}</h3>
      <p className="note-description">{note.description}</p>
      <div className="note-card-actions">
        <button aria-label={`Edit ${note.title}`} onClick={() => onEdit(note)} type="button">
          Edit
        </button>
        <button
          aria-label={`Delete ${note.title}`}
          className="delete-action"
          onClick={() => onDelete(note.id)}
          type="button"
        >
          Delete
        </button>
      </div>
    </article>
  );
}