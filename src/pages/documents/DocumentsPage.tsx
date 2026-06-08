import React, { useState, useRef } from 'react';
import {
  FileText, Upload, Download, Trash2, Share2, Search, Filter,
  Eye, PenLine, CheckCircle, Clock, AlertCircle, X, Plus, File, FileImage
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

type DocStatus = 'draft' | 'in-review' | 'signed';
type DocType = 'PDF' | 'Document' | 'Spreadsheet' | 'Contract';

interface Document {
  id: number;
  name: string;
  type: DocType;
  size: string;
  lastModified: string;
  shared: boolean;
  status: DocStatus;
  parties?: string[];
  description?: string;
}

const initialDocs: Document[] = [
  { id: 1, name: 'Investment Term Sheet v3.pdf', type: 'PDF', size: '2.4 MB', lastModified: '2026-05-20', shared: true, status: 'in-review', parties: ['Michael Chen', 'Sarah Johnson'], description: 'Series A term sheet with preferred stock terms' },
  { id: 2, name: 'Financial Projections 2026.xlsx', type: 'Spreadsheet', size: '1.8 MB', lastModified: '2026-05-18', shared: false, status: 'draft', description: '5-year financial model and projections' },
  { id: 3, name: 'NDA - TechWave AI.pdf', type: 'Contract', size: '0.8 MB', lastModified: '2026-05-15', shared: true, status: 'signed', parties: ['Alex Rivera', 'Sarah Johnson'], description: 'Non-disclosure agreement for due diligence' },
  { id: 4, name: 'Pitch Deck 2026.pdf', type: 'PDF', size: '5.1 MB', lastModified: '2026-05-10', shared: true, status: 'draft', description: 'Investor pitch deck - Series A round' },
  { id: 5, name: 'Shareholder Agreement.pdf', type: 'Contract', size: '3.2 MB', lastModified: '2026-05-05', shared: true, status: 'signed', parties: ['Michael Chen', 'Sarah Johnson', 'Alex Rivera'], description: 'Founding shareholder rights and obligations' },
  { id: 6, name: 'Business Plan Q2 2026.docx', type: 'Document', size: '2.1 MB', lastModified: '2026-04-28', shared: false, status: 'draft', description: 'Quarterly business plan and strategy' },
];

const statusConfig: Record<DocStatus, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  draft: { label: 'Draft', color: 'text-dark-500', icon: <AlertCircle size={14}/>, bg: 'bg-dark-100' },
  'in-review': { label: 'In Review', color: 'text-warning-700', icon: <Clock size={14}/>, bg: 'bg-warning-50' },
  signed: { label: 'Signed', color: 'text-accent-700', icon: <CheckCircle size={14}/>, bg: 'bg-accent-50' },
};

const typeIcon: Record<DocType, React.ReactNode> = {
  PDF: <FileText size={20} className="text-error-500" />,
  Contract: <FileText size={20} className="text-primary-500" />,
  Document: <File size={20} className="text-secondary-500" />,
  Spreadsheet: <FileImage size={20} className="text-accent-600" />,
};

export const DocumentsPage: React.FC = () => {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<DocStatus | 'all'>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [showSignPad, setShowSignPad] = useState<number | null>(null);
  const [preview, setPreview] = useState<Document | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [signature, setSignature] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const filtered = docs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: number) => setDocs(prev => prev.filter(d => d.id !== id));

  const handleStatusChange = (id: number, status: DocStatus) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleSign = (id: number) => {
    handleStatusChange(id, 'signed');
    setShowSignPad(null);
    setSignature('');
    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !lastPos.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastPos.current = { x, y };
  };

  const stopDraw = () => { setIsDrawing(false); lastPos.current = null; };

  const stats = {
    total: docs.length,
    signed: docs.filter(d => d.status === 'signed').length,
    inReview: docs.filter(d => d.status === 'in-review').length,
    draft: docs.filter(d => d.status === 'draft').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Document Chamber</h1>
          <p className="text-dark-500">Manage deals, contracts, and important files</p>
        </div>
        <Button leftIcon={<Upload size={16}/>} onClick={() => setShowUpload(true)}>
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: stats.total, color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50', text: 'text-primary-700' },
          { label: 'Signed', value: stats.signed, color: 'from-accent-500 to-accent-600', bg: 'bg-accent-50', text: 'text-accent-700' },
          { label: 'In Review', value: stats.inReview, color: 'from-warning-500 to-warning-600', bg: 'bg-warning-50', text: 'text-warning-700' },
          { label: 'Drafts', value: stats.draft, color: 'from-dark-400 to-dark-500', bg: 'bg-dark-50', text: 'text-dark-600' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardBody className="py-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                  <span className="text-white font-bold text-base">{stat.value}</span>
                </div>
                <p className={`text-sm font-semibold ${stat.text}`}>{stat.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..." 
            className="w-full pl-10 pr-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
        </div>
        <div className="flex gap-2">
          {(['all', 'draft', 'in-review', 'signed'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                filterStatus === s ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-dark-200 text-dark-600 hover:bg-dark-50'
              }`}>
              {s === 'all' ? 'All' : s === 'in-review' ? 'In Review' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card><CardBody><div className="text-center py-10 text-dark-400"><FileText size={40} className="mx-auto mb-2 opacity-30"/><p>No documents found</p></div></CardBody></Card>
        ) : (
          filtered.map(doc => {
            const sc = statusConfig[doc.status];
            return (
              <Card key={doc.id} hover>
                <CardBody className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-dark-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      {typeIcon[doc.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-dark-900 text-sm truncate">{doc.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                          {sc.icon}{sc.label}
                        </span>
                        {doc.shared && <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded-full">Shared</span>}
                      </div>
                      {doc.description && <p className="text-xs text-dark-400 mt-0.5 truncate">{doc.description}</p>}
                      <div className="flex items-center gap-3 mt-1 text-xs text-dark-400">
                        <span>{doc.size}</span>
                        <span>Modified {doc.lastModified}</span>
                        {doc.parties && <span>{doc.parties.length} parties</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => setPreview(doc)} className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Preview">
                        <Eye size={16}/>
                      </button>
                      {doc.status !== 'signed' && (
                        <button onClick={() => setShowSignPad(doc.id)} className="p-2 text-dark-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors" title="Sign">
                          <PenLine size={16}/>
                        </button>
                      )}
                      <button className="p-2 text-dark-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors" title="Share">
                        <Share2 size={16}/>
                      </button>
                      <button className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Download">
                        <Download size={16}/>
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="p-2 text-dark-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-dark-100">
              <h2 className="text-lg font-bold text-dark-900">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="p-1.5 hover:bg-dark-100 rounded-lg"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-dark-200 hover:border-primary-300 hover:bg-primary-50/30'}`}>
                <Upload size={32} className={`mx-auto mb-3 ${isDragging ? 'text-primary-600' : 'text-dark-300'}`} />
                <p className="text-sm font-semibold text-dark-700">Drop files here or <span className="text-primary-600">browse</span></p>
                <p className="text-xs text-dark-400 mt-1">PDF, DOCX, XLSX — up to 50MB</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1">Document Status</label>
                <select className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="draft">Draft</option>
                  <option value="in-review">In Review</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setShowUpload(false)}>Cancel</Button>
                <Button fullWidth onClick={() => setShowUpload(false)}>Upload</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Pad Modal */}
      {showSignPad !== null && (
        <div className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-dark-100">
              <h2 className="text-lg font-bold text-dark-900">E-Signature</h2>
              <button onClick={() => { setShowSignPad(null); clearCanvas(); }} className="p-1.5 hover:bg-dark-100 rounded-lg"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-dark-500">Draw your signature below or type your name</p>
              <div>
                <p className="text-xs font-semibold text-dark-600 mb-1.5">Draw Signature</p>
                <canvas ref={canvasRef} width={380} height={120}
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                  className="w-full border-2 border-dark-200 rounded-xl cursor-crosshair bg-dark-50" style={{touchAction:'none'}} />
                <button onClick={clearCanvas} className="mt-1 text-xs text-dark-400 hover:text-dark-600">Clear</button>
              </div>
              <div>
                <p className="text-xs font-semibold text-dark-600 mb-1.5">Or type your full name</p>
                <input value={signature} onChange={e => setSignature(e.target.value)}
                  placeholder="Your full legal name"
                  className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-serif italic" />
              </div>
              <div className="bg-warning-50 border border-warning-200 rounded-xl p-3 text-xs text-warning-700">
                By signing, you agree this electronic signature is legally binding.
              </div>
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => { setShowSignPad(null); clearCanvas(); }}>Cancel</Button>
                <Button variant="success" fullWidth leftIcon={<CheckCircle size={15}/>}
                  onClick={() => handleSign(showSignPad)}>
                  Sign Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-dark-100">
              <h2 className="text-base font-bold text-dark-900 truncate pr-4">{preview.name}</h2>
              <button onClick={() => setPreview(null)} className="p-1.5 hover:bg-dark-100 rounded-lg flex-shrink-0"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-dark-50 to-dark-100 rounded-2xl aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  {typeIcon[preview.type]}
                  <p className="text-dark-500 text-sm mt-2 font-medium">{preview.type} Preview</p>
                  <p className="text-xs text-dark-400 mt-1">Preview not available in demo</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-dark-400">Status</span><span className={`font-semibold ${statusConfig[preview.status].color}`}>{statusConfig[preview.status].label}</span></div>
                <div className="flex justify-between"><span className="text-dark-400">Size</span><span className="font-medium text-dark-700">{preview.size}</span></div>
                <div className="flex justify-between"><span className="text-dark-400">Modified</span><span className="font-medium text-dark-700">{preview.lastModified}</span></div>
                {preview.parties && <div className="flex justify-between"><span className="text-dark-400">Parties</span><span className="font-medium text-dark-700">{preview.parties.join(', ')}</span></div>}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" fullWidth leftIcon={<Download size={15}/>}>Download</Button>
                {preview.status !== 'signed' && (
                  <Button fullWidth leftIcon={<PenLine size={15}/>}
                    onClick={() => { setPreview(null); setShowSignPad(preview.id); }}>
                    Sign Document
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
