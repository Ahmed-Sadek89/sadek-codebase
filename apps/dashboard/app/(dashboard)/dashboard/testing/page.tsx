
"use client";

import { useState } from "react";

export default function ImageUploader() {
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");
  const [id, setId] = useState("");

  async function uploadImage(file: File) {
    setLoading(true);

    try {
      const response = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: file.type,
          size: file.size,
        }),
      });

      if (!response.ok) {
        throw new Error("Presign request failed");
      }

      const { uploadUrl, id, key } = await response.json();

      const upload = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!upload.ok) {
        throw new Error("S3 upload failed");
      }

      setKey(key);
      setId(id);
      console.log("Uploaded:", key);

      // Next: confirm upload with your backend
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function removeImage() {
    setLoading(true);

    try {
      const response = await fetch(`/api/uploads/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete request failed");
      }

      setKey("");
      setId("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={loading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadImage(file);
        }}
      />

      {loading && <p>Uploading...</p>}
      {key && (
        <p>
          Uploaded key: {key}{" "}
          <button type="button" disabled={loading} onClick={() => void removeImage()}>
            Remove
          </button>
        </p>
      )}
    </div>
  );
}
