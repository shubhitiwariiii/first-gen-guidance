'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Document {
    id: string
    name: string
    file_path: string
    file_size: number
    category: string
    created_at: string
}

export default function DocumentUpload({ userId }: { userId: string }) {
    const supabase = createClient()
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [category, setCategory] = useState('marksheet')
    const [error, setError] = useState('')

    useEffect(() => {
        fetchDocuments()
    }, [])

    async function fetchDocuments() {
        const { data } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        setDocuments(data || [])
        setLoading(false)
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            setError('File too large. Max size is 5MB.')
            return
        }

        setUploading(true)
        setError('')

        const filePath = `${userId}/${Date.now()}_${file.name}`

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file)

        if (uploadError) {
            setError(uploadError.message)
            setUploading(false)
            return
        }

        const { error: dbError } = await supabase.from('documents').insert({
            user_id: userId,
            name: file.name,
            file_path: filePath,
            file_size: file.size,
            category,
        })

        if (dbError) setError(dbError.message)
        else fetchDocuments()

        setUploading(false)
        e.target.value = ''
    }

    async function handleDelete(doc: Document) {
        await supabase.storage.from('documents').remove([doc.file_path])
        await supabase.from('documents').delete().eq('id', doc.id)
        fetchDocuments()
    }

    async function handleDownload(doc: Document) {
        const { data } = await supabase.storage
            .from('documents')
            .createSignedUrl(doc.file_path, 60)
        if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    }

    function formatSize(bytes: number) {
        return (bytes / 1024).toFixed(1) + ' KB'
    }

    function getCategoryColor(cat: string) {
        const colors: Record<string, string> = {
            marksheet: 'bg-blue-900 text-blue-400',
            income: 'bg-yellow-900 text-yellow-400',
            id_proof: 'bg-purple-900 text-purple-400',
            certificate: 'bg-green-900 text-green-400',
            other: 'bg-gray-700 text-gray-300',
        }
        return colors[cat] || colors.other
    }

    return (
        <div className="bg-gray-900 rounded-xl p-6 space-y-4">
            <div>
                <h2 className="text-white font-bold text-lg">📄 Documents</h2>
                <p className="text-gray-400 text-sm">Upload marksheets, certificates and ID proofs</p>
            </div>

            {/* Required documents info */}
            <div className="bg-gray-800 rounded-lg p-4 border border-yellow-800 space-y-3">
                <p className="text-yellow-400 text-sm font-semibold">📋 Documents needed for scholarship applications:</p>
                <div className="grid grid-cols-1 gap-2">
                    {[
                        { doc: 'Marksheet (10th & 12th)', why: 'Required for most merit-based scholarships', must: true },
                        { doc: 'Income Certificate', why: 'Required for income-based scholarships like NSP', must: true },
                        { doc: 'Aadhaar Card', why: 'Identity proof for all government scholarships', must: true },
                        { doc: 'Caste Certificate', why: 'Required for SC/ST/OBC category scholarships', must: false },
                        { doc: 'Bank Passbook / Cancelled Cheque', why: 'For scholarship amount disbursement', must: true },
                        { doc: 'Domicile Certificate', why: 'Required for state government scholarships', must: false },
                    ].map(item => (
                        <div key={item.doc} className="flex items-start gap-2">
                            <span className={`mt-0.5 text-xs px-1.5 py-0.5 rounded font-semibold shrink-0 ${item.must ? 'bg-red-900 text-red-400' : 'bg-gray-700 text-gray-400'}`}>
                                {item.must ? 'Must' : 'Optional'}
                            </span>
                            <div>
                                <p className="text-white text-sm font-medium">{item.doc}</p>
                                <p className="text-gray-500 text-xs">{item.why}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Document completion status */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-2">
                <p className="text-white text-sm font-semibold">Your upload checklist:</p>
                {[
                    { label: 'Marksheet', category: 'marksheet' },
                    { label: 'Income Certificate', category: 'income' },
                    { label: 'ID Proof (Aadhaar)', category: 'id_proof' },
                    { label: 'Bank Passbook', category: 'certificate' },
                ].map(item => {
                    const uploaded = documents.some(d => d.category === item.category)
                    return (
                        <div key={item.category} className="flex items-center gap-2">
                            <span className={`text-lg ${uploaded ? 'text-green-400' : 'text-gray-600'}`}>
                                {uploaded ? '✅' : '⬜'}
                            </span>
                            <span className={`text-sm ${uploaded ? 'text-green-400' : 'text-gray-400'}`}>
                                {item.label}
                            </span>
                        </div>
                    )
                })}

                {/* Completion message */}
                {['marksheet', 'income', 'id_proof', 'certificate'].every(
                    cat => documents.some(d => d.category === cat)
                ) ? (
                    <div className="mt-2 p-2 bg-green-900 border border-green-700 rounded text-green-400 text-sm">
                        ✅ All required documents uploaded! You are ready to find scholarships.
                    </div>
                ) : (
                    <p className="text-yellow-500 text-xs mt-1">
                        Upload all required documents for accurate scholarship matching.
                    </p>
                )}
            </div>

            {/* Upload section */}
            <div className="bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-700">
                <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                        Step 1: Select document type
                    </p>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full p-3 rounded bg-gray-700 text-white text-sm border-2 border-blue-500 focus:outline-none"
                    >
                        <option value="marksheet">📋 Marksheet</option>
                        <option value="income">💰 Income Certificate</option>
                        <option value="id_proof">🪪 ID Proof (Aadhaar/PAN)</option>
                        <option value="certificate">🏦 Bank Passbook</option>
                        <option value="other">📄 Other</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                        Step 2: Upload file
                    </p>
                    <label className={`flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <p className="text-gray-400 text-sm">
                            {uploading ? 'Uploading...' : '📁 Click to upload (PDF, JPG, PNG — max 5MB)'}
                        </p>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            {/* Documents list */}
            {loading && (
                <div className="space-y-2">
                    {[1, 2].map(i => (
                        <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && documents.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                    No documents uploaded yet.
                </p>
            )}

            {!loading && documents.map(doc => (
                <div key={doc.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="text-2xl">📄</span>
                            <div className="min-w-0">
                                <p className="text-white text-sm font-semibold truncate">{doc.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(doc.category)}`}>
                                        {doc.category}
                                    </span>
                                    <span className="text-gray-500 text-xs">{formatSize(doc.file_size)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => handleDownload(doc)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg"
                            >
                                View
                            </button>
                            <button
                                onClick={() => handleDelete(doc)}
                                className="px-3 py-1 bg-red-900 hover:bg-red-800 text-red-400 text-xs rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}