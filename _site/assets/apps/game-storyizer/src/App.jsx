import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import {
    Plus, Trash2, Copy, Download, Upload, Move, X, Check,
    Settings, ZoomIn, ZoomOut, AlertTriangle, Link, Unlink,
    MousePointer2, ChevronRight, CornerDownRight, FileText, Grid,
    RefreshCw, Folder, Pencil, List, TableProperties, ArrowRight, Maximize, Wand2, ListPlus
} from 'lucide-react';

// --- Constants ---
const STORAGE_KEY = 'story_graph_v13_sets';
const SNAP_GRID = 20;
const DEFAULT_SET_ID = 'default-story';
const MAGNET_DISTANCE = 60;

const INITIAL_NODES = [
    { id: '1', x: 50, y: 150, label: 'Start: Wake up' },
    { id: '2', x: 400, y: 50, label: 'Find Key' },
    { id: '3', x: 400, y: 250, label: 'Break Window' },
    { id: '4', x: 750, y: 150, label: 'Escape Room' }
];

const INITIAL_EDGES = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e3-4', source: '3', target: '4' }
];

const INITIAL_LOGIC = {
    '4': [['2'], ['3']]
};

const DEFAULT_STATE = {
    activeSetId: DEFAULT_SET_ID,
    sets: {
        [DEFAULT_SET_ID]: {
            id: DEFAULT_SET_ID,
            name: 'My First Story',
            nodes: INITIAL_NODES,
            edges: INITIAL_EDGES,
            logic: INITIAL_LOGIC,
            edgeBends: {},
            pan: { x: 0, y: 0 },
            scale: 1,
            lastModified: Date.now(),
        }
    }
};

// --- Custom Hook: Long Press ---
const useLongPress = (callback = () => { }, ms = 800) => {
    const [startLongPress, setStartLongPress] = useState(false);
    const timerId = useRef(null);

    const start = useCallback((e) => {
        setStartLongPress(true);
        timerId.current = setTimeout(() => {
            callback(e);
            if (navigator.vibrate) navigator.vibrate(50);
            setStartLongPress(false);
        }, ms);
    }, [callback, ms]);

    const stop = useCallback((e) => {
        if (timerId.current) {
            clearTimeout(timerId.current);
            timerId.current = null;
        }
        setStartLongPress(false);
    }, []);

    return {
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
    };
};

// --- Layout Algorithm ---
const calculateAutoLayout = (nodes, edges) => {
    const newNodes = nodes.map(n => ({ ...n }));
    const newEdgeBends = {};
    const depths = {};
    newNodes.forEach(n => depths[n.id] = 0);

    // 1. Depths
    for (let i = 0; i < newNodes.length + 2; i++) {
        let changed = false; edges.forEach(e => {
            const sDepth = depths[e.source] || 0;
            const tDepth = depths[e.target] || 0;
            if (sDepth + 1 > tDepth) {
                depths[e.target] = sDepth + 1;
                changed = true;
            }
        });
        if (!changed) break;
    }

    // 2. Layers & Virtual Nodes
    const layers = [];
    const maxDepth = Math.max(...Object.values(depths), 0);
    for (let d = 0; d <= maxDepth; d++) layers[d] = []; newNodes.forEach(n => layers[depths[n.id]].push({
        type: 'real', node: n,
        id: n.id
    }));

    edges.forEach(e => {
        const sDepth = depths[e.source];
        const tDepth = depths[e.target];
        if (tDepth > sDepth + 1) {
            for (let d = sDepth + 1; d < tDepth; d++) {
                layers[d].push({
                    type: 'virtual', sourceId: e.source, targetId:
                        e.target, id: `v-${e.source}-${e.target}-${d}`
                });
            }
        }
    });
    // 3. Sorting 
    layers.forEach(l => l.sort((a, b) => a.id.localeCompare(b.id)));
    for (let d = 1; d < layers.length; d++) {
        const layer = layers[d]; const prevLayer = layers[d - 1];
        layer.forEach(item => {
            let parentIds = [];
            if (item.type === 'real') {
                parentIds = edges.filter(e => e.target === item.id).map(e => e.source);
            } else {
                const prevVirtual = prevLayer.find(p => p.type === 'virtual' && p.sourceId === item.sourceId &&
                    p.targetId === item.targetId);
                parentIds = prevVirtual ? [prevVirtual.id] : [item.sourceId];
            }
            let sum = 0, count = 0;
            parentIds.forEach(pid => {
                const idx = prevLayer.findIndex(p => p.id === pid || (p.type === 'real' && p.id === pid));
                if (idx !== -1) { sum += idx; count++; }
            });
            item._weight = count > 0 ? sum / count : layer.indexOf(item);
        });
        layer.sort((a, b) => a._weight - b._weight);
    }

    // 4. Coordinates
    const SPACING_X = 350;
    const SPACING_Y = 180;
    const START_X = 50;
    const START_Y = 50;

    layers.forEach((layer, colIdx) => {
        layer.forEach((item, rowIdx) => {
            const x = START_X + colIdx * SPACING_X;
            const y = START_Y + rowIdx * SPACING_Y;
            if (item.type === 'real') {
                item.node.x = x;
                item.node.y = y;
            } else {
                const edgeId = edges.find(e => e.source === item.sourceId && e.target === item.targetId)?.id;
                if (edgeId) {
                    if (!newEdgeBends[edgeId]) newEdgeBends[edgeId] = [];
                    newEdgeBends[edgeId].push({ x: x + 100, y: y + 40 });
                }
            }
        });
    });

    return { nodes: newNodes, edgeBends: newEdgeBends };
};

// --- Helper Functions ---

const getCleanLogic = (nodeId, currentEdges, currentLogic) => {
    const incomingIds = currentEdges.filter(e => e.target === nodeId).map(e => e.source);
    const currentGroups = currentLogic[nodeId] || [];
    const usedIds = new Set(currentGroups.flat());
    const newIds = incomingIds.filter(id => !usedIds.has(id));
    const validIncomingSet = new Set(incomingIds);
    let newGroups = currentGroups.map(group => group.filter(id => validIncomingSet.has(id))).filter(g =>
        g.length > 0);
    newIds.forEach(id => newGroups.push([id]));
    return newGroups;
};

// --- Isolated Components ---

const Modal = memo(({ title, isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-100">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
});

const NewSetModalContent = memo(({ onCreate, onClose }) => {
    const [name, setName] = useState('');
    return (
        <form onSubmit={(e) => { e.preventDefault(); onCreate(name); }}>
            <input autoFocus placeholder="Story Name (e.g. Heist Puzzle)"
                className="w-full bg-slate-950 text-white px-3 py-2 rounded border border-slate-700 focus:border-indigo-500 mb-6 outline-none"
                value={name} onChange={e => setName(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
                <button type="button" onClick={onClose}
                    className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">Cancel</button>
                <button type="submit" disabled={!name.trim()}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg disabled:opacity-50">Create</button>
            </div>
        </form>
    );
});

const RenameSetModalContent = memo(({ onRename, onClose, currentName }) => {
    const [name, setName] = useState(currentName);
    return (
        <form onSubmit={(e) => { e.preventDefault(); onRename(name); }}>
            <input autoFocus
                className="w-full bg-slate-950 text-white px-3 py-2 rounded border border-slate-700 focus:border-indigo-500 mb-6 outline-none"
                value={name} onChange={e => setName(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
                <button type="button" onClick={onClose}
                    className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">Cancel</button>
                <button type="submit" disabled={!name.trim()}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg disabled:opacity-50">Save</button>
            </div>
        </form>
    );
});

const BulkAddModalContent = memo(({ onAdd, onClose }) => {
    const [text, setText] = useState('');
    return (
        <div>
            <p className="text-sm text-slate-400 mb-4">Paste lines of text. Each line will become a new node.
            </p>
            <textarea
                className="w-full h-64 bg-slate-950 text-slate-300 p-3 rounded border border-slate-700 focus:border-indigo-500 mb-4 outline-none text-sm resize-none"
                placeholder="Wake up in cell&#10;Check under bed&#10;Call guard&#10;Pick lock" value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
            />
            <div className="flex gap-3 justify-end">
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">Cancel</button>
                <button
                    onClick={() => onAdd(text)}
                    disabled={!text.trim()}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg disabled:opacity-50"
                >
                    Add Nodes
                </button>
            </div>
        </div>
    );
});

const ImportJsonModalContent = memo(({ onImport, onClose }) => {
    const [text, setText] = useState('');
    return (
        <div>
            <p className="text-sm text-slate-400 mb-4">Paste the JSON data (Nodes, Edges, Meta) below.</p>
            <textarea
                className="w-full h-64 bg-slate-950 text-slate-300 p-3 rounded border border-slate-700 focus:border-indigo-500 mb-4 outline-none text-xs font-mono resize-none"
                placeholder='{ "meta": { ... }, "nodes": [ ... ] }'
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">Cancel</button>
                <button
                    onClick={() => onImport(text)}
                    disabled={!text.trim()}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg disabled:opacity-50"
                >
                    Import & Layout
                </button>
            </div>
        </div>
    );
});

const EditorDrawer = memo(({
    isOpen, onClose, selectedNodeId,
    nodes, edges, logic,
    updateSet, updateNodeLogic, deleteSelected
}) => {
    const node = nodes.find(n => n.id === selectedNodeId);
    if (!node) return null;

    const incomingEdges = edges.filter(e => e.target === node.id);
    const outgoingEdges = edges.filter(e => e.source === node.id);
    const groups = getCleanLogic(node.id, edges, logic);

    const [selectedInputs, setSelectedInputs] = useState([]);
    const [manualConnectId, setManualConnectId] = useState('');

    const handleCheckbox = (sourceId) => {
        setSelectedInputs(prev => prev.includes(sourceId) ? prev.filter(id => id !== sourceId) : [...prev, sourceId]);
    };

    const handleManualConnect = () => {
        if (manualConnectId && manualConnectId !== node.id) {
            const exists = edges.find(e => e.source === manualConnectId && e.target === node.id);
            const reverse = edges.find(e => e.source === node.id && e.target === manualConnectId);
            if (!exists && !reverse) {
                updateSet({ edges: [...edges, { id: `e${manualConnectId}-${node.id}`, source: manualConnectId, target: node.id }] });
            }
            setManualConnectId('');
        }
    };

    const removeEdge = (sourceId, targetId) => {
        const newEdges = edges.filter(e => !(e.source === sourceId && e.target === targetId));
        updateSet({ edges: newEdges });
        const targetLogic = getCleanLogic(targetId, newEdges, logic);
        updateNodeLogic(targetId, targetLogic);
    };

    const ungroup = (groupIdx) => {
        const currentGroups = getCleanLogic(node.id, edges, logic);
        const groupToExplode = currentGroups[groupIdx];
        const remaining = currentGroups.filter((_, idx) => idx !== groupIdx);
        groupToExplode.forEach(id => remaining.push([id]));
        updateNodeLogic(node.id, remaining);
    };

    const groupAsAnd = () => {
        const currentGroups = getCleanLogic(node.id, edges, logic);
        let remainingGroups = currentGroups.map(g => g.filter(id => !selectedInputs.includes(id))).filter(g => g.length > 0);
        remainingGroups.push(selectedInputs);
        updateNodeLogic(node.id, remainingGroups);
        setSelectedInputs([]);
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
                <h3 className="text-sm font-bold text-white">Edit Node</h3>
                <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="mb-6">
                    <label className="text-xs uppercase font-bold text-slate-500 mb-2 block">Event Name</label>
                    <textarea
                        className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:border-indigo-500 outline-none text-sm resize-none"
                        rows={3}
                        value={node.label}
                        onChange={(e) => updateSet({ nodes: nodes.map(n => n.id === node.id ? { ...n, label: e.target.value } : n) })}
                    />
                </div>
                <div className="mb-6 pb-6 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2"><ArrowRight size={14} /> Leads To (Output)</h4>
                    {outgoingEdges.length === 0 ? <p className="text-xs text-slate-500 italic">End of chain.</p> : (
                        <div className="space-y-2">
                            {outgoingEdges.map(edge => {
                                const target = nodes.find(n => n.id === edge.target);
                                return (
                                    <div key={edge.id} className="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700">
                                        <span className="text-sm text-slate-200 truncate">{target?.label || 'Unknown'}</span>
                                        <button onClick={() => removeEdge(edge.source, edge.target)} className="text-slate-500 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="mb-6 pb-6 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-indigo-400 mb-3 flex items-center gap-2"><Link size={14} /> Prerequisites (Input)</h4>
                    {incomingEdges.length === 0 ? <div className="p-3 bg-slate-800/50 rounded-lg text-xs text-slate-500 text-center border border-slate-800 border-dashed">No incoming connections.</div> : (
                        <div className="space-y-4">
                            {groups.map((group, gIdx) => (
                                <div key={gIdx} className={`bg-slate-800/50 rounded-lg p-3 border relative group ${group.length > 1 ? 'border-indigo-500/50 bg-indigo-900/10' : 'border-slate-700'}`}>
                                    <div className={`absolute -top-2.5 left-3 px-2 text-[10px] font-bold border rounded-full ${group.length > 1 ? 'bg-indigo-900 text-indigo-200 border-indigo-700' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>
                                        {group.length > 1 ? 'AND Group' : 'OR Path'}
                                    </div>
                                    <div className="space-y-2 mt-1">
                                        {group.map(sourceId => {
                                            const srcNode = nodes.find(n => n.id === sourceId);
                                            return (
                                                <div key={sourceId} className="flex items-center gap-2 text-sm text-slate-300">
                                                    <input type="checkbox" checked={selectedInputs.includes(sourceId)} onChange={() => handleCheckbox(sourceId)} className="rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-0" />
                                                    <span className="truncate flex-1">{srcNode?.label || 'Unknown'}</span>
                                                    <button onClick={() => removeEdge(sourceId, node.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {group.length > 1 && <button onClick={() => ungroup(gIdx)} className="mt-3 w-full py-1 text-xs text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded flex items-center justify-center gap-1"><Unlink size={12} /> Ungroup</button>}
                                </div>
                            ))}
                            {selectedInputs.length > 1 && <button onClick={groupAsAnd} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-sm font-bold shadow-lg mt-4 flex items-center justify-center gap-2"><Link size={14} /> Group {selectedInputs.length} as AND</button>}
                        </div>
                    )}
                </div>
                <div className="mb-6">
                    <label className="text-xs uppercase font-bold text-slate-500 mb-2 block">Connect From...</label>
                    <div className="flex gap-2">
                        <select className="flex-1 bg-slate-800 text-white text-xs p-2 rounded border border-slate-700" value={manualConnectId} onChange={e => setManualConnectId(e.target.value)}>
                            <option value="">Select Event...</option>
                            {nodes.filter(n => n.id !== node.id && !edges.find(e => e.source === n.id && e.target === node.id)).map(n => (<option key={n.id} value={n.id}>{n.label}</option>))}
                        </select>
                        <button onClick={handleManualConnect} disabled={!manualConnectId} className="bg-slate-700 hover:bg-indigo-600 text-white px-3 rounded disabled:opacity-50"><Plus size={14} /></button>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-950">
                <button onClick={deleteSelected} className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-900/20 p-2 rounded transition-colors border border-transparent hover:border-red-900/30"><Trash2 size={16} /> Delete Node</button>
            </div>
        </div>
    );
});

const ListView = memo(({ nodes, edges, setViewMode, setSelectedNodeId, setIsEditorOpen }) => (
    <div className="flex-1 overflow-auto bg-slate-950 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><List /> Node List</h2>
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-xs uppercase text-slate-500 font-bold tracking-wider">
                            <th className="p-4">Event Name</th>
                            <th className="p-4 w-32 text-center">Incoming</th>
                            <th className="p-4">Leads To</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {nodes.map(node => {
                            const incomingCount = edges.filter(e => e.target === node.id).length;
                            const outgoing = edges.filter(e => e.source === node.id).map(e => {
                                const t = nodes.find(n => n.id === e.target);
                                return t ? t.label : 'Unknown';
                            });
                            return (
                                <tr key={node.id} className="hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => { setViewMode('graph'); setSelectedNodeId(node.id); setIsEditorOpen(true); }}>
                                    <td className="p-4 text-slate-200 font-medium">{node.label}</td>
                                    <td className="p-4 text-center">
                                        {incomingCount === 0 ? <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">Start</span> : <span className="text-slate-500 text-sm">{incomingCount}</span>}
                                    </td>
                                    <td className="p-4">
                                        {outgoing.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {outgoing.map((l, i) => <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20">{l}</span>)}
                                            </div>
                                        ) : <span className="text-slate-600 text-xs italic">End of chain</span>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
));

// --- Main App ---

export default function StoryGraphApp() {
    const [appState, setAppState] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : DEFAULT_STATE;
        } catch (e) {
            console.error("Failed to load save", e);
            return DEFAULT_STATE;
        }
    });

    const activeSetId = appState.activeSetId;
    const currentSet = appState.sets[activeSetId] || appState.sets[DEFAULT_SET_ID];
    const { nodes, edges, logic, pan, scale, edgeBends = {} } = currentSet;

    const [viewMode, setViewMode] = useState('graph');
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isNewSetModalOpen, setIsNewSetModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [draggingNode, setDraggingNode] = useState(null);
    const [draggingPan, setDraggingPan] = useState(null);
    const [connecting, setConnecting] = useState(null);
    const [snapTargetId, setSnapTargetId] = useState(null);

    const dragStartRef = useRef({ x: 0, y: 0 });
    const graphRef = useRef(null);

    // Mobile Viewport Fix
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0';
        document.head.appendChild(meta);
        return () => { };
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    }, [appState]);

    const updateSet = useCallback((updates) => {
        setAppState(prev => ({
            ...prev,
            sets: {
                ...prev.sets,
                [prev.activeSetId]: {
                    ...prev.sets[prev.activeSetId],
                    ...updates,
                    lastModified: Date.now()
                }
            }
        }));
    }, []);

    const updateNodeLogic = (nodeId, newGroups) => {
        updateSet({ logic: { ...logic, [nodeId]: newGroups } });
    };

    const handleCreateSet = (name) => {
        const newId = `set-${Date.now()}`;
        const newSet = {
            id: newId,
            name,
            nodes: [{ id: '1', x: 50, y: 150, label: 'Start' }],
            edges: [],
            logic: {},
            edgeBends: {},
            pan: { x: 0, y: 0 },
            scale: 1,
            lastModified: Date.now()
        };
        setAppState(prev => ({ activeSetId: newId, sets: { ...prev.sets, [newId]: newSet } }));
        setIsNewSetModalOpen(false);
    };

    const handleRenameSet = (newName) => {
        updateSet({ name: newName });
        setIsRenameModalOpen(false);
    };

    const handleDeleteSet = () => {
        const setKeys = Object.keys(appState.sets);
        if (setKeys.length <= 1) return;
        const newSets = { ...appState.sets };
        delete newSets[activeSetId];
        const newActive = Object.keys(newSets)[0];
        setAppState({ activeSetId: newActive, sets: newSets });
        setItemToDelete(null);
    };

    // Bulk Import with Grid
    const handleBulkAdd = (text) => {
        if (!text.trim()) return;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const newNodes = [];
        const rect = graphRef.current ? graphRef.current.getBoundingClientRect() : { width: 800, height: 600 };
        const startX = (-pan.x + rect.width / 2) / scale;
        const startY = (-pan.y + rect.height / 2) / scale;

        const COL_HEIGHT = 5;
        const SPACING_X = 250;
        const SPACING_Y = 150;

        lines.forEach((line, idx) => {
            const id = `bulk-${Date.now()}-${idx}`;
            const col = Math.floor(idx / COL_HEIGHT);
            const row = idx % COL_HEIGHT;
            const x = Math.round((startX + (col * SPACING_X)) / SNAP_GRID) * SNAP_GRID;
            const y = Math.round((startY + (row * SPACING_Y)) / SNAP_GRID) * SNAP_GRID;
            newNodes.push({ id, x, y, label: line });
        });

        updateSet({ nodes: [...nodes, ...newNodes] });
        setIsBulkAddModalOpen(false);
    };

    // JSON Import & Auto Layout
    const handleImportJson = (jsonStr) => {
        try {
            const data = JSON.parse(jsonStr);

            if (!data.nodes || !data.edges) {
                alert("Invalid JSON: Missing nodes or edges.");
                return;
            }

            // Transform Logic Array -> Object if needed
            let newLogic = {};
            if (Array.isArray(data.logic)) {
                data.logic.forEach(l => {
                    newLogic[l.targetId] = l.paths;
                });
            } else {
                newLogic = data.logic || {};
            }

            // Transform Edges (from/to -> source/target)
            const newEdges = data.edges.map(e => ({
                id: e.id || `e${e.from}-${e.to}`,
                source: e.from || e.source,
                target: e.to || e.target
            }));

            // Basic Node Hydration (add missing props)
            const newNodes = data.nodes.map(n => ({
                id: n.id,
                label: n.label,
                x: n.x || 0,
                y: n.y || 0
            }));

            // Create new Set
            const newId = `set-${Date.now()}`;
            const newSet = {
                id: newId,
                name: data.meta?.title || 'Imported Story',
                nodes: newNodes,
                edges: newEdges,
                logic: newLogic,
                edgeBends: {},
                pan: { x: 0, y: 0 },
                scale: 1,
                lastModified: Date.now()
            };

            // Run Layout immediately
            const layoutResult = calculateAutoLayout(newSet.nodes, newSet.edges);
            newSet.nodes = layoutResult.nodes;
            newSet.edgeBends = layoutResult.edgeBends;

            setAppState(prev => ({
                activeSetId: newId,
                sets: { ...prev.sets, [newId]: newSet }
            }));
            setIsImportOpen(false);

        } catch (e) {
            alert("Failed to parse JSON: " + e.message);
        }
    };

    // Interactions
    const handlePointerDown = (e) => {
        if (e.target === graphRef.current) {
            e.preventDefault();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            setDraggingPan({ startX: pan.x, startY: pan.y, mouseX: cx, mouseY: cy });
        }
    };

    const handleNodePointerDown = (e, id) => {
        e.stopPropagation();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        dragStartRef.current = { x: cx, y: cy };
        const node = nodes.find(n => n.id === id);
        setDraggingNode({ id, startX: node.x, startY: node.y, mouseX: cx, mouseY: cy });
    };

    const handleNodeClick = (id) => {
        if (selectedNodeId === id) {
            setIsEditorOpen(true);
        } else {
            setSelectedNodeId(id);
            setIsEditorOpen(false);
        }
    };

    const handlePointerMove = (e) => {
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;

        if (draggingNode) {
            e.preventDefault();
            const dx = (cx - draggingNode.mouseX) / scale;
            const dy = (cy - draggingNode.mouseY) / scale;
            const updatedNodes = nodes.map(n => {
                if (n.id === draggingNode.id) {
                    let nx = draggingNode.startX + dx;
                    let ny = draggingNode.startY + dy;
                    nx = Math.round(nx / SNAP_GRID) * SNAP_GRID;
                    ny = Math.round(ny / SNAP_GRID) * SNAP_GRID;
                    return { ...n, x: nx, y: ny };
                }
                return n;
            });
            // Clear bends connected to this node
            const newEdgeBends = { ...edgeBends };
            edges.forEach(edge => {
                if ((edge.source === draggingNode.id || edge.target === draggingNode.id) && newEdgeBends[edge.id]) {
                    delete newEdgeBends[edge.id];
                }
            });
            updateSet({ nodes: updatedNodes, edgeBends: newEdgeBends });
        } else if (draggingPan) {
            e.preventDefault();
            updateSet({
                pan: {
                    x: draggingPan.startX + (cx - draggingPan.mouseX),
                    y: draggingPan.startY + (cy - draggingPan.mouseY)
                }
            });
        } else if (connecting) {
            const rect = graphRef.current.getBoundingClientRect();
            const mx = (cx - rect.left - pan.x) / scale;
            const my = (cy - rect.top - pan.y) / scale;
            let bestDist = Infinity;
            let bestId = null;
            nodes.forEach(n => {
                if (n.id === connecting.sourceId) return;
                const dx = mx - (n.x + 100);
                const dy = my - (n.y + 40);
                const dist = Math.hypot(dx, dy);
                if (dist < MAGNET_DISTANCE / scale) {
                    if (dist < bestDist) { bestDist = dist; bestId = n.id; }
                }
            });
            setSnapTargetId(bestId);
            setConnecting(prev => ({ ...prev, mouseX: cx, mouseY: cy }));
        }
    };

    const handlePointerUp = (e) => {
        if (draggingNode) {
            const cx = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            const cy = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
            const dist = Math.hypot(cx - dragStartRef.current.x, cy - dragStartRef.current.y);
            if (dist < 5) handleNodeClick(draggingNode.id);
        }
        if (connecting && snapTargetId) completeConnection(connecting.sourceId, snapTargetId);
        setDraggingNode(null); setDraggingPan(null); setConnecting(null); setSnapTargetId(null);
    };

    const handleConnectStart = (e, sourceId) => {
        e.stopPropagation(); e.preventDefault();
        const rect = graphRef.current.getBoundingClientRect();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        const x = (cx - rect.left - pan.x) / scale;
        const y = (cy - rect.top - pan.y) / scale;
        setConnecting({ sourceId, x, y, mouseX: cx, mouseY: cy });
    };

    const completeConnection = (sourceId, targetId) => {
        if (sourceId === targetId) return;
        const exists = edges.find(e => e.source === sourceId && e.target === targetId);
        const reverse = edges.find(e => e.source === targetId && e.target === sourceId);
        if (!exists && !reverse) {
            updateSet({ edges: [...edges, { id: `e${sourceId}-${targetId}`, source: sourceId, target: targetId }] });
        }
    };

    const handleAutoLayout = () => {
        const result = calculateAutoLayout(nodes, edges);
        updateSet({ nodes: result.nodes, edgeBends: result.edgeBends });
    };

    // Zoom
    const zoomIn = () => updateSet({ scale: Math.min(2, scale + 0.1) });
    const zoomOut = () => updateSet({ scale: Math.max(0.1, scale - 0.1) });
    const zoomReset = () => updateSet({ scale: 1, pan: { x: 0, y: 0 } });

    const addNode = () => {
        const id = Date.now().toString();
        const rect = graphRef.current ? graphRef.current.getBoundingClientRect() : { width: 800, height: 600 };
        const centerX = (-pan.x + rect.width / 2) / scale;
        const centerY = (-pan.y + rect.height / 2) / scale;
        const newNode = { id, x: Math.round(centerX / SNAP_GRID) * SNAP_GRID, y: Math.round(centerY / SNAP_GRID) * SNAP_GRID, label: 'New Event' };
        updateSet({ nodes: [...nodes, newNode] });
        setSelectedNodeId(id);
        setIsEditorOpen(true);
    };

    const deleteSelected = () => {
        if (!selectedNodeId) return;
        const newNodes = nodes.filter(n => n.id !== selectedNodeId);
        const newEdges = edges.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId);
        const newLogic = { ...logic };
        delete newLogic[selectedNodeId];
        Object.keys(newLogic).forEach(key => { newLogic[key] = newLogic[key].map(group => group.filter(sid => sid !== selectedNodeId)).filter(g => g.length > 0); });
        updateSet({ nodes: newNodes, edges: newEdges, logic: newLogic });
        setSelectedNodeId(null);
        setIsEditorOpen(false);
    };

    // Header Long Press
    const headerLongPress = useLongPress(() => setIsRenameModalOpen(true), 800);

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden"
            onMouseMove={handlePointerMove} onMouseUp={handlePointerUp} onTouchMove={handlePointerMove} onTouchEnd={handlePointerUp}
        >
            <header className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 z-10 shrink-0 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20 hidden md:block"><CornerDownRight size={20} className="text-white" /></div>
                    <div className="flex flex-col gap-0.5 select-none active:scale-95 transition-transform" {...headerLongPress}>
                        <div className="flex items-center gap-2"><label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current Story</label><Pencil size={10} className="text-slate-600 opacity-50" /></div>
                        <div className="relative group">
                            <select value={activeSetId} onChange={(e) => { setAppState(prev => ({ ...prev, activeSetId: e.target.value })); setSelectedNodeId(null); setIsEditorOpen(false); }} className="appearance-none bg-transparent text-white font-bold text-base focus:outline-none w-full cursor-pointer pr-6 truncate z-10 relative py-0.5 rounded hover:bg-slate-900">
                                {Object.values(appState.sets).map(set => <option key={set.id} value={set.id} className="bg-slate-900">{set.name}</option>)}
                            </select>
                            <Folder size={14} className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsImportOpen(true)} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded" title="Import JSON"><Upload size={18} /></button>
                    <button onClick={() => setIsBulkAddModalOpen(true)} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded" title="Bulk Add"><ListPlus size={18} /></button>
                    <button onClick={() => setIsNewSetModalOpen(true)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded" title="New Set"><Plus size={18} /></button>
                    {Object.keys(appState.sets).length > 1 && <button onClick={() => setItemToDelete({ type: 'set' })} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded"><Trash2 size={18} /></button>}
                    <div className="h-6 w-px bg-slate-800 mx-2 hidden sm:block"></div>
                    <button onClick={handleAutoLayout} className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded flex items-center gap-1" title="Auto Layout"><Wand2 size={18} /></button>
                    <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 ml-1">
                        <button onClick={() => setViewMode('graph')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'graph' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}><Grid size={16} /></button>
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}><TableProperties size={16} /></button>
                    </div>
                    <button onClick={addNode} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium text-sm shadow-lg ml-2"><Plus size={16} /> <span className="hidden sm:inline">Node</span></button>
                    <button onClick={() => setIsExportOpen(true)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded ml-1"><FileText size={18} /></button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {viewMode === 'list' ? <ListView nodes={nodes} edges={edges} setViewMode={setViewMode} setSelectedNodeId={setSelectedNodeId} setIsEditorOpen={setIsEditorOpen} /> : (
                    <div
                        ref={graphRef}
                        className="flex-1 relative bg-slate-950 overflow-hidden cursor-move touch-none"
                        style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: `${20 * scale}px ${20 * scale}px`, backgroundPosition: `${pan.x}px ${pan.y}px`, touchAction: 'none' }}
                        onMouseDown={handlePointerDown} onTouchStart={handlePointerDown}
                    >
                        <div className="absolute origin-top-left" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}>
                            <svg className="overflow-visible pointer-events-none absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#64748b" /></marker>
                                    <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" /></marker>
                                    <marker id="arrowhead-and" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#818cf8" /></marker>
                                </defs>
                                {edges.map(edge => {
                                    const source = nodes.find(n => n.id === edge.source);
                                    const target = nodes.find(n => n.id === edge.target);
                                    if (!source || !target) return null;
                                    const sx = source.x + 200; const sy = source.y + 40; const tx = target.x; const ty = target.y + 40;
                                    const bends = edgeBends[edge.id];

                                    let path = '';
                                    if (bends && bends.length > 0) {
                                        path = `M ${sx} ${sy}`;
                                        path += ` C ${sx + 50} ${sy} ${bends[0].x - 50} ${bends[0].y} ${bends[0].x} ${bends[0].y}`;
                                        for (let i = 0; i < bends.length - 1; i++) {
                                            path += ` L ${bends[i + 1].x} ${bends[i + 1].y}`;
                                        }
                                        const lastBend = bends[bends.length - 1];
                                        path += ` C ${lastBend.x + 50} ${lastBend.y} ${tx - 50} ${ty} ${tx} ${ty}`;
                                    } else {
                                        path = `M ${sx} ${sy} C ${sx + 150} ${sy} ${tx - 150} ${ty} ${tx} ${ty}`;
                                    }

                                    const groups = getCleanLogic(target.id, edges, logic);
                                    const isAnd = groups.some(g => g.length > 1 && g.includes(source.id));
                                    const strokeColor = isAnd ? "#818cf8" : "#475569";
                                    const marker = isAnd ? "url(#arrowhead-and)" : "url(#arrowhead)";
                                    return <path key={edge.id} d={path} stroke={strokeColor} strokeWidth={isAnd ? 3 : 2} fill="none" markerEnd={marker} />;
                                })}
                                {connecting && (
                                    <path d={`M ${connecting.x} ${connecting.y} L ${(connecting.mouseX - graphRef.current.getBoundingClientRect().left - pan.x) / scale} ${(connecting.mouseY - graphRef.current.getBoundingClientRect().top - pan.y) / scale}`} stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowhead-active)" />
                                )}
                            </svg>
                            {nodes.map(node => {
                                const isSnapped = snapTargetId === node.id;
                                return (
                                    <div key={node.id} onMouseDown={(e) => handleNodePointerDown(e, node.id)} onTouchStart={(e) => handleNodePointerDown(e, node.id)} onMouseUp={(e) => handleConnectEnd(e, node.id)} onTouchEnd={(e) => handleConnectEnd(e, node.id)} onClick={(e) => { e.stopPropagation(); handleNodeClick(node.id); }}
                                        className={`absolute w-[200px] bg-slate-800 rounded-lg shadow-lg border transition-all group select-none ${selectedNodeId === node.id ? 'border-indigo-500 shadow-indigo-500/20 ring-1 ring-indigo-500 z-20' : 'border-slate-700 hover:border-slate-500 z-10'} ${isSnapped ? 'border-emerald-500 ring-4 ring-emerald-500/30 scale-105 shadow-emerald-500/50' : ''}`}
                                        style={{ left: node.x, top: node.y }}
                                    >
                                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-600 border border-slate-900 z-10" />
                                        <div className="p-3">
                                            <div className="text-[10px] font-mono text-slate-500 mb-1">ID: {node.id.slice(-3)}</div>
                                            <div className="text-sm font-medium text-slate-100 pointer-events-none line-clamp-3 leading-tight">{node.label}</div>
                                        </div>
                                        {getCleanLogic(node.id, edges, logic).some(g => g.length > 1) && <div className="absolute -top-2 right-2 bg-indigo-500 text-white text-[9px] px-1.5 rounded-full border border-indigo-400 pointer-events-none shadow-sm shadow-indigo-500/50 font-bold tracking-wide">AND</div>}
                                        <div onMouseDown={(e) => handleConnectStart(e, node.id)} onTouchStart={(e) => handleConnectStart(e, node.id)} className="absolute -right-8 top-0 bottom-0 w-16 flex items-center justify-center cursor-crosshair z-30 touch-manipulation opacity-0 hover:opacity-100">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/50 border-2 border-indigo-300 shadow-sm flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                                        </div>
                                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-600 border border-slate-900 pointer-events-none" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <EditorDrawer isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} selectedNodeId={selectedNodeId} nodes={nodes} edges={edges} logic={logic} updateSet={updateSet} updateNodeLogic={updateNodeLogic} deleteSelected={deleteSelected} />
            </div>

            <div className="absolute bottom-6 left-6 flex flex-col gap-2 pointer-events-none z-30">
                <div className="bg-slate-900/90 backdrop-blur rounded-lg border border-slate-700 p-1 pointer-events-auto shadow-xl flex flex-col items-center">
                    <button onClick={zoomIn} className="p-2 text-slate-300 hover:text-white block active:bg-slate-800 rounded"><ZoomIn size={20} /></button>
                    <div className="h-px w-full bg-slate-700 my-1"></div>
                    <button onClick={zoomReset} className="p-2 text-xs font-bold text-slate-400 hover:text-white block active:bg-slate-800 rounded">{Math.round(scale * 100)}%</button>
                    <div className="h-px w-full bg-slate-700 my-1"></div>
                    <button onClick={zoomOut} className="p-2 text-slate-300 hover:text-white block active:bg-slate-800 rounded"><ZoomOut size={20} /></button>
                </div>
            </div>

            <Modal title="Start New Story" isOpen={isNewSetModalOpen} onClose={() => setIsNewSetModalOpen(false)}>
                <NewSetModalContent onCreate={handleCreateSet} onClose={() => setIsNewSetModalOpen(false)} />
            </Modal>

            <Modal title="Rename Story" isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)}>
                <RenameSetModalContent onRename={handleRenameSet} onClose={() => setIsRenameModalOpen(false)} currentName={currentSet.name} />
            </Modal>

            <Modal title="Bulk Add Nodes" isOpen={isBulkAddModalOpen} onClose={() => setIsBulkAddModalOpen(false)}>
                <BulkAddModalContent onAdd={handleBulkAdd} onClose={() => setIsBulkAddModalOpen(false)} />
            </Modal>

            <Modal title="Import JSON" isOpen={isImportOpen} onClose={() => setIsImportOpen(false)}>
                <ImportJsonModalContent onImport={handleImportJson} onClose={() => setIsImportOpen(false)} />
            </Modal>

            <Modal title="Export Story Data" isOpen={isExportOpen} onClose={() => setIsExportOpen(false)}>
                <p className="text-sm text-slate-400 mb-2">Markdown Logic Table:</p>
                <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap h-40 overflow-auto select-all mb-4">
                    {(() => {
                        if (nodes.length === 0) return "No data.";
                        let md = `# ${currentSet.name}\n\n| Event Node | Prerequisites (Logic) | Leads To |\n|---|---|---|\n`;
                        nodes.forEach(node => {
                            const groups = getCleanLogic(node.id, edges, logic);
                            let logicStr = "";
                            if (groups.length === 0) {
                                const isStart = edges.filter(e => e.target === node.id).length === 0;
                                logicStr = isStart ? "*(Start)*" : "(Unconnected)";
                            } else {
                                const orParts = groups.map(group => {
                                    if (group.length === 1) {
                                        const src = nodes.find(n => n.id === group[0]);
                                        return src ? `**${src.label}**` : "Unknown";
                                    } else {
                                        const andParts = group.map(id => {
                                            const src = nodes.find(n => n.id === id);
                                            return src ? `**${src.label}**` : "Unknown";
                                        });
                                        return `( ${andParts.join(" AND ")} )`;
                                    }
                                });
                                logicStr = orParts.join(" <br/>**OR**<br/> ");
                            }
                            const outEdges = edges.filter(e => e.source === node.id);
                            let outStr = outEdges.length === 0 ? "*(End)*" : outEdges.map(e => {
                                const target = nodes.find(n => n.id === e.target);
                                return target ? `[ ] ${target.label}` : "";
                            }).join("<br/>");
                            md += `| ${node.label} | ${logicStr} | ${outStr} |\n`;
                        });
                        return md;
                    })()}
                </div>
                <p className="text-sm text-slate-400 mb-2">Raw JSON Data (Game Engine Ready):</p>
                <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs text-indigo-300 whitespace-pre-wrap h-40 overflow-auto select-all">
                    {JSON.stringify({
                        meta: { title: currentSet.name, exportedAt: new Date().toISOString() },
                        nodes: nodes.map(n => ({ id: n.id, label: n.label })),
                        edges: edges.map(e => ({ from: e.source, to: e.target })),
                        logic: Object.entries(logic).map(([targetId, groups]) => ({ targetId, condition: groups.length > 1 ? 'OR' : 'SINGLE', paths: groups }))
                    }, null, 2)}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                    <button onClick={() => setIsExportOpen(false)} className="px-4 py-2 bg-slate-800 text-white rounded text-sm">Close</button>
                </div>
            </Modal>

            {itemToDelete && (
                <Modal title="Delete Story?" isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)}>
                    <p className="text-slate-300 mb-6">Are you sure you want to delete <b>{currentSet.name}</b>?</p>
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setItemToDelete(null)} className="px-4 py-2 text-slate-400">Cancel</button>
                        <button onClick={handleDeleteSet} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                    </div>
                </Modal>
            )}

            {/* Mobile Actions Overlay */}
            <button onClick={addNode} className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center md:hidden z-40 transition-transform active:scale-95"><Plus size={28} /></button>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>
        </div>
    );
}