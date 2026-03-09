"use client";

import { useState, useRef, useCallback } from "react";
import { useMock } from "@/lib/firebase";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export function ImageUpload({ onUpload, currentUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Selecione um arquivo de imagem.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      if (useMock) {
        onUpload("mock-url");
        return;
      }

      setUploading(true);
      try {
        const { uploadFile, getStoragePath } = await import("@/lib/storage");
        const path = getStoragePath("uploads", "user", file.name);
        const url = await uploadFile(path, file);
        setPreview(url);
        onUpload(url);
      } catch (err) {
        console.error("Erro ao fazer upload:", err);
        alert("Erro ao fazer upload da imagem.");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
          >
            <X size={16} />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted"
          }`}
        >
          <div className="flex flex-col items-center gap-2 text-muted">
            {isDragging ? (
              <ImageIcon size={32} className="text-primary" />
            ) : (
              <Upload size={32} />
            )}
            <span className="text-sm">
              {isDragging ? "Solte a imagem aqui" : "Clique ou arraste uma imagem"}
            </span>
            <span className="text-xs">PNG, JPG, WEBP</span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
