"use client";

import { useEffect, useState } from "react";
import NoteItem from "../components/note-item";

const STORAGE_KEY = "margin-notes";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [hasDuplicate, setHasDuplicate] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const savedNotes = window.localStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        if (Array.isArray(parsedNotes)) setNotes(parsedNotes);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (storageReady) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, storageReady]);

  useEffect(() => {
    const normalizedTitle = title.trim().toLocaleLowerCase();
    const normalizedDescription = description.trim().toLocaleLowerCase();
    const duplicate = normalizedTitle && normalizedDescription && notes.some((note) => (
      note.id !== editingId
      && note.title.trim().toLocaleLowerCase() === normalizedTitle
      && note.description.trim().toLocaleLowerCase() === normalizedDescription
    ));

    setHasDuplicate(Boolean(duplicate));
  }, [description, editingId, notes, title]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle || !cleanDescription || hasDuplicate) return;

    if (editingId) {
      setNotes((currentNotes) => currentNotes.map((note) => (
        note.id === editingId
          ? { ...note, title: cleanTitle, description: cleanDescription, updatedAt: Date.now() }
          : note
      )));
    } else {
      setNotes((currentNotes) => [{
        id: globalThis.crypto.randomUUID(),
        title: cleanTitle,
        description: cleanDescription,
        updatedAt: Date.now(),
      }, ...currentNotes]);
    }

    resetForm();
  }

  function startEditing(note) {
    setTitle(note.title);
    setDescription(note.description);
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteNote(noteId) {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
    if (editingId === noteId) resetForm();
  }

  const formIsInvalid = !title.trim() || !description.trim() || hasDuplicate;

  return (
    <main className="page-shell">
      <div className="workspace">
        <header className="topbar">
          <a className="brand" href="#notes" aria-label="Margin notes home">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span>margin<span className="brand-period">.</span></span>
          </a>
          <span className="topbar-label">A quieter place to think</span>
        </header>

        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL NOTEBOOK</p>
          <div className="intro-row">
            <div>
              <h1 id="page-title">Keep the good thoughts.</h1>
              <p className="intro-copy">Small ideas, plans, and everything worth remembering.</p>
            </div>
            <div className="note-count" aria-live="polite">
              <span className="count-number">{notes.length.toString().padStart(2, "0")}</span>
              <span className="count-label">{notes.length === 1 ? "note saved" : "notes saved"}</span>
            </div>
          </div>
        </section>

        <div className="content-grid" id="notes">
          <section className="composer" aria-labelledby="composer-title">
            <div className="section-heading">
              <span className="section-index">01</span>
              <h2 id="composer-title">{editingId ? "Edit your note" : "A note to self"}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="note-title">TITLE</label>
              <input
                autoComplete="off"
                id="note-title"
                maxLength={90}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Give it a name"
                value={title}
              />

              <label className="field-label description-label" htmlFor="note-description">YOUR THOUGHT</label>
              <textarea
                id="note-description"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Let it out of your head..."
                rows={7}
                value={description}
              />

              <p className={`form-message${hasDuplicate ? " is-warning" : ""}`} aria-live="polite">
                {hasDuplicate ? "You already saved this exact note." : "Both fields are needed to save."}
              </p>
              <div className="form-actions">
                <button className="save-button" disabled={formIsInvalid} type="submit">
                  <span>{editingId ? "Update note" : "Save note"}</span>
                  <span aria-hidden="true" className="button-arrow">↗</span>
                </button>
                {editingId && (
                  <button className="cancel-button" onClick={resetForm} type="button">Cancel</button>
                )}
              </div>
            </form>
            <p className="privacy-note"><span aria-hidden="true" /> Saved in this browser, just for you.</p>
          </section>

          <section className="notes-section" aria-labelledby="notes-title">
            <div className="notes-heading">
              <div className="section-heading">
                <span className="section-index">02</span>
                <h2 id="notes-title">Your notes</h2>
              </div>
              <span className="notes-total">{notes.length} {notes.length === 1 ? "ITEM" : "ITEMS"}</span>
            </div>

            {notes.length > 0 ? (
              <div className="notes-grid">
                {notes.map((note, index) => (
                  <NoteItem
                    index={index}
                    key={note.id}
                    note={note}
                    onDelete={deleteNote}
                    onEdit={startEditing}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-mark" aria-hidden="true"><span /></span>
                <h3>Nothing on the page. Yet.</h3>
                <p>Your first note can be anything at all.</p>
              </div>
            )}
          </section>
        </div>

        <footer className="page-footer">
          <span>MAKE ROOM FOR WHAT MATTERS</span>
          <span className="footer-spark" aria-hidden="true">✳</span>
          <span>YOUR THOUGHTS, YOURS ALONE</span>
        </footer>
      </div>
    </main>
  );
}
