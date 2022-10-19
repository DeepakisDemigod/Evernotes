let App = "Evernote";

export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="notes__sidebar">
                <h1>Evernotes</h1>
                <iframe src="/Quotes/quote.html" frameborder="0"></iframe>
                <hr>
                <br>
                <button class="notes__add" type="button">+ Add Note</button>
                <div class="notes__list"></div>
            </div>
            <div class="notes__preview">
                <div class="nav">
                    <button class="bold">B</button>
                    <button class="italic">I</button>
                    <button class="underline">U</button>
                    <button class="todo">Todo</button>
                    <button class="line-through">S</button>
                    <button class="subscript">Sub</button>
                    <button class="superscript">Sup</button>
                    <select id="themeSelect">
                      <option value="dark">
                        Dark
                      </option>
                      <option value="default">
                        Light
                      </option>
                    </select>
                </div>
                <br>
                <input class="notes__title" type="text" placeholder="New Note...">
                <textarea class="notes__body">Take Note ✍️</textarea>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");
        
        
        
        
        function initThemeSelector() {
          const themeSelect = document.getElementById("themeSelect");
          const themeStyleSheetLink = document.getElementById("themeStyleSheetLink");
          //const currentTheme = localStorage.getItem("theme") || "default";
          
          function activateTheme(themeName) {
            themeStyleSheetLink.setAttribute("href", `/css/${themeName}.css`);
          }
          
          themeSelect.addEventListener("change", () => {
            activateTheme(themeSelect.value);
          });
          
          //activateTheme(currentTheme);
          
        }
        
        initThemeSelector();
        
        
        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");

        // Empty list
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes_list-item[data-note-id="${note.id}"]`).classList.add("notes_list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}
