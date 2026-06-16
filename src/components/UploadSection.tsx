"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";
type AttachmentPreview = {
  id: string;
  name: string;
  url: string;
};

/**
 * "Upload your
scam proof".
 * Sektionsbilden visas som vanligt. En osynlig hotspot ligger ovanpå
 * upload-ikonen i bilden — klick öppnar formuläret som en modal (<dialog>).
 *
 * PLACERA HOTSPOTEN: justera top/left/width/height för .upload__trigger
 * i globals.css tills rutan täcker upload-ikonen. Det finns separata värden
 * för desktop och mobil (ikonen sitter olika i de två bildvarianterna).
 * Avkommentera dev-outlinen i samma regel för att se rutan medan du placerar.
 */
export default function UploadSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);

  useEffect(() => {
    return () => {
      attachmentPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [attachmentPreviews]);

  function clearAttachmentPreviews() {
    attachmentPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setAttachmentPreviews([]);
  }

  function openModal() {
    setStatus("idle");
    setMessage("");
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  // Stäng vid klick på den mörka ytan utanför panelen.
  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) closeModal();
  }

  function handleAttachmentsChange(e: React.ChangeEvent<HTMLInputElement>) {
    clearAttachmentPreviews();

    const files = Array.from(e.currentTarget.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    setAttachmentPreviews(
      files.map((file) => ({
        id: file.name + "-" + file.lastModified + "-" + file.size,
        name: file.name,
        url: URL.createObjectURL(file),
      }))
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("api/submit", {
        method: "POST",
        body: new FormData(formEl),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Något gick fel. Försök igen.");
        return;
      }

      setStatus("success");
      setMessage("thank you! your scam proof was submitted!");
      formEl.reset();
      clearAttachmentPreviews();
    } catch {
      setStatus("error");
      setMessage("Kunde inte skicka. Kontrollera din anslutning.");
    }
  }

  return (
    <section id="upload" className="upload">
      <picture>
        <source media="(max-width: 767px)" srcSet="/images/upload-mobile.png" />
        <img src="/images/upload-desktop.png" alt="Upload your scam proof" />
      </picture>

      {/* Osynlig klickyta ovanpå upload-ikonen i bilden */}
      <button
        type="button"
        className="upload__trigger"
        onClick={openModal}
        aria-label="Öppna formuläret — ladda upp din scam proof"
      />

      <dialog
        ref={dialogRef}
        className="uploadModal"
        onClick={handleDialogClick}
        aria-labelledby="uploadModalTitle"
      >
        <div className="uploadModal__inner">
          <img
            className="uploadModal__logo"
            src="/images/modal-logo.png"
            alt=""
            aria-hidden="true"
          />
          <button
            type="button"
            className="uploadModal__close"
            onClick={closeModal}
            aria-label="Stäng"
          >
            ×
          </button>

          <form className="scamForm" onSubmit={handleSubmit}>
            <img src="/images/upload-title.png" alt="Upload your scam proof" className="scamForm__titleImg" />
            <label className="scamForm__field">
              <span>Name</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>

            <div className="scamForm__row">
              <label className="scamForm__field">
                <span>City</span>
                <input name="city" type="text" autoComplete="address-level2" required />
              </label>

              <label className="scamForm__field">
                <span>Country</span>
                <input name="country" type="text" autoComplete="country-name" required />
              </label>
            </div>

            <label className="scamForm__field">
              <span>Age</span>
              <input name="age" type="number" min="1" max="120" required />
            </label>

            <label className="scamForm__field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>

            <label className="scamForm__field">
              <span>Artist you were supposed to see</span>
              <input name="artist" type="text" required />
            </label>

            <label className="scamForm__field">
              <span>Your story</span>
              <textarea name="story" required rows={2} />
            </label>

            <label className="scamForm__field scamForm__field--attachments">
              <span>Attachments</span>
              <input
                id="attachments"
                className="scamForm__fileInput"
                name="attachments"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAttachmentsChange}
              />
              <span className="scamForm__fileButton">Choose files</span>
            </label>

            {attachmentPreviews.length > 0 && (
              <div className="scamForm__previews" aria-label="Selected images">
                {attachmentPreviews.map((preview) => (
                  <figure className="scamForm__preview" key={preview.id}>
                    <button
                      type="button"
                      className="scamForm__previewRemove"
                      onClick={() => {
                        URL.revokeObjectURL(preview.url);
                        setAttachmentPreviews((prev) => prev.filter((p) => p.id !== preview.id));
                      }}
                      aria-label={`Ta bort ${preview.name}`}
                    >×</button>
                    <img src={preview.url} alt="" />
                    <figcaption>{preview.name}</figcaption>
                  </figure>
                ))}
              </div>
            )}

            <label className="scamForm__field scamForm__field--checkbox">
              <input type="checkbox" name="terms" required />
              <span>
                i agree to the{" "}
                <a href="/terms" target="_blank" rel="noreferrer">
                  terms and conditions
                </a>
              </span>
            </label>

            <button
              type="submit"
              className="scamForm__submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Submitting..." : "Submit"}
            </button>

            {message && (
              <p
                className={"scamForm__msg scamForm__msg--" + status}
                role="status"
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </dialog>
    </section>
  );
}
