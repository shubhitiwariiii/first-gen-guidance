'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, FileText, Trash2, Eye, CheckCircle, AlertCircle } from 'lucide-react'

interface Document {
  id: string
  name: string
  file_path: string
  file_size: number
  category: string
  created_at: string
}

const CATEGORIES = [
  { value: 'marksheet', label: 'Marksheet', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { value: 'income', label: 'Income Certificate', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  { value: 'id_proof', label: 'ID Proof', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { value: 'certificate', label: 'Bank Passbook', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { value: 'other', label: 'Other', color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
]

const REQUIRED = ['marksheet', 'income', 'id_proof', 'certificate']

export default function DocumentUpload({ userId }: { userId: string }) {
  const supabase = createClient()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('marksheet')
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => { fetchDocuments() }, [])

  async function fetchDocuments() {
    const { data } = await supabase.from('documents').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    setDocuments(data || [])
    setLoading(false)
  }

  async function handleUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) { setError('File too large. Max 5MB.'); return }
    setUploading(true)
    setError('')
    const filePath = `${userId}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file)
    if (uploadError) { setError(uploadError.message); setUploading(false); return }
    await supabase.from('documents').insert({ user_id: userId, name: file.name, file_path: filePath, file_size: file.size, category })
    fetchDocuments()
    setUploading(false)
  }

  async function handleDelete(doc: Document) {
    await supabase.storage.from('documents').remove([doc.file_path])
    await supabase.from('documents').delete().eq('id', doc.id)
    fetchDocuments()
  }

  async function handleView(doc: Document) {
    const { data } = await supabase.storage.from('documents').createSignedUrl(doc.file_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  const uploadedCategories = documents.map(d => d.category)
  const allDocsUploaded = REQUIRED.every(cat => uploadedCategories.includes(cat))

  function getCategoryStyle(cat: string) {
    return CATEGORIES.find(c => c.value === cat)?.color || CATEGORIES[4].color
  }

  function getCategoryLabel(cat: string) {
    return CATEGORIES.find(c => c.value === cat)?.label || cat
  }

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">Documents</h2>
            <p className="text-gray-500 text-xs mt-0.5">{documents.length} file{documents.length !== 1 ? 's' : ''} uploaded</p>
          </div>
          {allDocsUploaded ? (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              Ready
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full">
              <AlertCircle className="w-3.5 h-3.5" />
              {REQUIRED.filter(r => !uploadedCategories.includes(r)).length} missing
            </div>
          )}
        </div>
      </div>

      {/* Checklist */}
      <div className="px-6 py-4 border-b border-white/5 space-y-2">
        {REQUIRED.map(cat => {
          const uploaded = uploadedCategories.includes(cat)
          const label = getCategoryLabel(cat)
          return (
            <div key={cat} className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${uploaded ? 'bg-emerald-500' : 'bg-white/10'}`}>
                {uploaded && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-xs ${uploaded ? 'text-gray-300' : 'text-gray-500'}`}>{label}</span>
            </div>
          )
        })}
      </div>

      {/* Upload area */}
      <div className="px-6 py-4 border-b border-white/5 space-y-3">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        <label
          className={`relative flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/3'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files[0]
            if (file) handleUpload(file)
          }}
        >
          <Upload className={`w-6 h-6 mb-2 ${dragOver ? 'text-blue-400' : 'text-gray-600'}`} />
          <p className="text-gray-400 text-xs text-center">
            {uploading ? 'Uploading...' : 'Drop file here or click to upload'}
          </p>
          <p className="text-gray-600 text-xs mt-1">PDF, JPG, PNG · Max 5MB</p>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = '' }} disabled={uploading} className="hidden" />
        </label>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Files list */}
      <div className="px-6 py-4 space-y-2">
        {loading && [1,2].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}

        {!loading && documents.length === 0 && (
          <p className="text-gray-600 text-xs text-center py-4">No documents uploaded yet</p>
        )}

        {!loading && documents.map(doc => (
          <div key={doc.id} className="flex items-center gap-3 p-3 bg-white/3 border border-white/5 rounded-xl hover:bg-white/5 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{doc.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-1.5 py-0.5 rounded border ${getCategoryStyle(doc.category)}`}>
                  {getCategoryLabel(doc.category)}
                </span>
                <span className="text-gray-600 text-xs">{(doc.file_size / 1024).toFixed(0)} KB</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button onClick={() => handleView(doc)} className="p-1.5 hover:bg-blue-500/10 rounded-lg text-gray-500 hover:text-blue-400 transition-all">
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(doc)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}