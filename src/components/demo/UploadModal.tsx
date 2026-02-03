'use client';

import { useState, useCallback, useRef, DragEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { uploadFiles, pollJobStatus, type JobStatus } from '@/src/lib/demo/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const ACCEPTED_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function UploadModal({ isOpen, onClose, onSuccess, showToast }: UploadModalProps) {
  // File selection state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload state (managed locally)
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isComplete = status && ['completed', 'partial', 'failed'].includes(status.status);

  const resetState = useCallback(() => {
    setSelectedFiles([]);
    setIsUploading(false);
    setProgress(0);
    setStatus(null);
    setError(null);
  }, []);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter((file) =>
      ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setProgress(0);
    setError(null);
    setStatus(null);

    const response = await uploadFiles(selectedFiles);

    if (response.error) {
      setError(response.error);
      setIsUploading(false);
      return;
    }

    const jobId = response.job_id || response.batch_job_id;
    if (!jobId) {
      setError('No job ID returned');
      setIsUploading(false);
      return;
    }

    // Poll for status
    const startTime = Date.now();
    const maxWait = 300000;

    while (Date.now() - startTime < maxWait) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const jobStatus = await pollJobStatus(jobId);
      setStatus(jobStatus);

      if (jobStatus.progress_percent !== undefined) {
        setProgress(jobStatus.progress_percent);
      }

      if (jobStatus.error) {
        setError(jobStatus.error);
        break;
      }

      if (['completed', 'partial', 'failed'].includes(jobStatus.status)) {
        if (jobStatus.status === 'completed') {
          showToast(`All ${jobStatus.completed_count || selectedFiles.length} videos processed!`, 'success');
        } else if (jobStatus.status === 'partial') {
          showToast(`${jobStatus.completed_count} succeeded, ${jobStatus.failed_count} failed`, 'warning');
        } else {
          showToast(`All ${jobStatus.failed_count} videos failed`, 'error');
        }
        onSuccess();
        break;
      }
    }

    setIsUploading(false);
  }, [selectedFiles, showToast, onSuccess]);

  const handleClose = useCallback(() => {
    if (!isUploading || isComplete) {
      resetState();
      onClose();
    }
  }, [isUploading, isComplete, resetState, onClose]);

  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

          <motion.div
            className="relative w-full max-w-lg mx-4 bg-background border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/10">
              <h2 className="text-xl font-semibold text-foreground">Upload Videos</h2>
              <button
                onClick={handleClose}
                disabled={isUploading && !isComplete}
                className="p-2 hover:bg-foreground/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {isUploading ? (
                // Upload progress view
                <div className="space-y-4">
                  <p className="text-foreground/70 text-center">
                    {isComplete ? 'Upload complete!' : `Uploading ${selectedFiles.length} video(s)...`}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-foreground/10 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        status?.status === 'failed' ? 'bg-red-500' :
                        status?.status === 'partial' ? 'bg-yellow-500' :
                        'bg-gradient-to-r from-blue-500 to-purple-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>

                  {status && (
                    <p className="text-sm text-center text-foreground/60">
                      {status.completed_count !== undefined && (
                        <>Completed: {status.completed_count} | Failed: {status.failed_count || 0}</>
                      )}
                    </p>
                  )}

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                  )}

                  {isComplete && (
                    <button
                      onClick={handleClose}
                      className="w-full py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground font-medium rounded-xl transition-all"
                    >
                      Close
                    </button>
                  )}
                </div>
              ) : (
                // File selection view
                <>
                  <p className="text-foreground/60 text-sm">
                    Upload videos to add them to the searchable database.
                  </p>

                  {/* Drop Zone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-foreground/20 hover:border-foreground/40'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={ACCEPTED_EXTENSIONS.join(',')}
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                    />
                    <svg className="w-12 h-12 mx-auto text-foreground/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-foreground/60">{isDragging ? 'Drop files here' : 'Click or drag to upload'}</p>
                    <p className="text-foreground/40 text-sm mt-1">MP4, MOV, AVI, MKV, WebM</p>
                  </div>

                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground/80">
                        {selectedFiles.length} file(s) ({formatFileSize(totalSize)})
                      </p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between px-3 py-2 bg-foreground/5 rounded-lg">
                            <span className="text-sm text-foreground/70 truncate flex-1">{file.name}</span>
                            <button onClick={() => removeFile(idx)} className="p-1 hover:bg-foreground/10 rounded">
                              <svg className="w-4 h-4 text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground font-medium rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={selectedFiles.length === 0}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl disabled:opacity-50"
                    >
                      Upload
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
