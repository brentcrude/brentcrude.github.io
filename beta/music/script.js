// --- Application State ---
let currentTool = { type: 'quarter', char: '𝅘𝅥', dur: 1, category: 'note' };
let audioCtx = null;
let tracks = [];
let noteIdCounter = 0;
let measureCount = 4;
let currentKey = 'C';

// Configuration
const PIXELS_PER_BEAT = 80;
const Y_SNAP = 10;
const X_SNAP = 40;

// Pitch & Key Engine
const diatonicToMidi = {
    '-30': 83, '-20': 81, '-10': 79, // Above staff
    0: 77, 10: 76, 20: 74, 30: 72, 40: 71, 50: 69, 60: 67, 70: 65, 80: 64, // Staff
    90: 62, 100: 60, 110: 59, 120: 57 // Below staff
};

// Maps Y coordinate intervals (mod 70) to Pitch Classes (C, D, E, etc.)
const yToPitchClass = (y) => {
    const noteNames = ['F', 'E', 'D', 'C', 'B', 'A', 'G'];
    return noteNames[(Math.floor(y / 10) % 7 + 7) % 7];
};

// Key Signature Definitions (Offsets for specific notes)
// e.g. In G major, F gets +1 (sharp)
const keySignatures = {
    'C':  {},
    'G':  { 'F': 1 },
    'D':  { 'F': 1, 'C': 1 },
    'F':  { 'B': -1 },
    'Bb': { 'B': -1, 'E': -1 }
};

// Visual display mappings for keys
const keyVisuals = {
    'C':  '',
    'G':  '<div style="position:absolute; top:-10px;">♯</div>',
    'D':  '<div style="position:absolute; top:-10px;">♯</div><div style="position:absolute; top:0px; left:6px;">♯</div>',
    'F':  '<div style="position:absolute; top:10px;">♭</div>',
    'Bb': '<div style="position:absolute; top:10px;">♭</div><div style="position:absolute; top: -5px; left:6px;">♭</div>'
};


// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    addTrack();
    
    // Playback & Settings
    document.getElementById('btn-play').addEventListener('click', playScore);
    document.getElementById('btn-stop').addEventListener('click', () => stopScore(true));
    
    // Track/Measure controls
    document.getElementById('btn-add-track').addEventListener('click', addTrack);
    document.getElementById('btn-del-track').addEventListener('click', deleteTrack);
    document.getElementById('btn-add-measure').addEventListener('click', addMeasure);
    document.getElementById('btn-del-measure').addEventListener('click', deleteMeasure);
    
    // Key Signature Change
    document.getElementById('key-sig-select').addEventListener('change', (e) => {
        currentKey = e.target.value;
        updateKeySignaturesVisually();
    });

    // Toolbar Tool Selection
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            const ds = e.currentTarget.dataset;
            if (ds.char) {
                currentTool = { category: 'note', type: ds.type, char: ds.char, dur: parseFloat(ds.dur) };
            } else if (ds.type === 'delete') {
                currentTool = { category: 'delete' };
            } else {
                currentTool = { category: 'modifier', type: ds.type, val: ds.val };
            }
        });
    });
});

// --- Score & Track Management ---
function addTrack() {
    const trackId = tracks.length;
    tracks.push({ id: trackId, notes: [] });

    const container = document.createElement('div');
    container.className = 'track-container';
    container.dataset.containerId = trackId;
    
    container.innerHTML = `
        <div class="clef-time-area">
            <div class="clef">𝄞</div>
            <div class="key-sig">${keyVisuals[currentKey]}</div>
            <div class="time-sig"><div>4</div><div>4</div></div>
        </div>
        <div class="track" data-track-id="${trackId}" style="width: ${measureCount * 320}px"></div>
    `;

    container.querySelector('.track').addEventListener('mousedown', handleTrackClick);
    document.getElementById('score').appendChild(container);
}

function deleteTrack() {
    if (tracks.length <= 1) return; // Don't delete the last track
    const trackId = tracks.length - 1;
    tracks.pop(); // Remove from logic
    const container = document.querySelector(`.track-container[data-container-id="${trackId}"]`);
    if(container) container.remove(); // Remove from DOM
}

function addMeasure() {
    measureCount++;
    document.querySelectorAll('.track').forEach(track => track.style.width = `${measureCount * 320}px`);
}

function deleteMeasure() {
    if (measureCount <= 1) return; // Must have at least 1 measure
    measureCount--;
    
    document.querySelectorAll('.track').forEach(track => {
        track.style.width = `${measureCount * 320}px`;
        
        // Remove notes that fall outside the new measure bounds
        const maxPixels = measureCount * 320;
        const trackId = parseInt(track.dataset.trackId);
        
        tracks[trackId].notes = tracks[trackId].notes.filter(note => {
            if (note.x > maxPixels - 20) {
                const el = document.getElementById(`note-${note.id}`);
                if (el) el.remove();
                return false;
            }
            return true;
        });
    });
}

function updateKeySignaturesVisually() {
    document.querySelectorAll('.key-sig').forEach(el => {
        el.innerHTML = keyVisuals[currentKey];
    });
}

// --- Note Placement & Interaction ---
function handleTrackClick(e) {
    if (e.target.closest('.note')) return; 
    if (currentTool.category !== 'note') return;

    const trackEl = e.currentTarget;
    const rect = trackEl.getBoundingClientRect();
    
    let x = Math.round((e.clientX - rect.left) / X_SNAP) * X_SNAP;
    let y = Math.round((e.clientY - rect.top) / Y_SNAP) * Y_SNAP;
    
    if (x < 20) x = 20; 
    if (y < -30) y = -30;
    if (y > 120) y = 120;

    createNote(trackEl, x, y, currentTool);
}

function createNote(trackEl, x, y, tool) {
    const trackId = parseInt(trackEl.dataset.trackId);
    const isRest = tool.type.includes('rest');
    const finalY = isRest ? 40 : y;

    const note = {
        id: noteIdCounter++, trackId: trackId,
        x: x, y: finalY,
        type: tool.type, char: tool.char, dur: tool.dur, isRest: isRest,
        accidental: null, articulation: null, dynamic: null
    };
    
    tracks[trackId].notes.push(note);
    renderNote(note, trackEl);
}

function renderNote(note, trackEl) {
    let el = document.getElementById(`note-${note.id}`);
    if (!el) {
        el = document.createElement('div');
        el.className = 'note';
        el.id = `note-${note.id}`;
        el.innerHTML = `
            <span class="modifiers accidental"></span>
            <span class="modifiers articulation"></span>
            <span class="modifiers dynamic"></span>
            <div class="ledgers"></div>
            <span class="symbol"></span>
        `;
        trackEl.appendChild(el);
        el.addEventListener('mousedown', (e) => handleNoteInteraction(e, note, el, trackEl));
    }
    
    el.style.left = `${note.x}px`;
    el.style.top = `${note.y}px`;
    el.querySelector('.symbol').innerText = note.char;
    
    const ledgerContainer = el.querySelector('.ledgers');
    ledgerContainer.innerHTML = '';
    if (!note.isRest) {
        if (note.y <= -20) {
            for(let l = -20; l >= note.y; l -= 20) ledgerContainer.innerHTML += `<div class="ledger" style="top: ${l - note.y + 20}px"></div>`;
        }
        if (note.y >= 100) {
            for(let l = 100; l <= note.y; l += 20) ledgerContainer.innerHTML += `<div class="ledger" style="top: ${l - note.y + 20}px"></div>`;
        }
    }

    el.querySelector('.accidental').innerText = note.accidental || '';
    el.querySelector('.articulation').innerText = note.articulation || '';
    el.querySelector('.dynamic').innerText = note.dynamic || '';
}

// --- Note Dragging & Modification ---
let draggedNote = null;

function handleNoteInteraction(e, note, el, trackEl) {
    e.stopPropagation();
    
    if (currentTool.category === 'delete') {
        el.remove();
        tracks[note.trackId].notes = tracks[note.trackId].notes.filter(n => n.id !== note.id);
        return;
    }

    if (currentTool.category === 'modifier') {
        if (note.isRest) return; 
        
        // Toggle off if same, otherwise apply new modifier
        if (currentTool.type === 'accidental') note.accidental = note.accidental === currentTool.val ? null : currentTool.val;
        if (currentTool.type === 'articulation') note.articulation = note.articulation === currentTool.val ? null : currentTool.val;
        if (currentTool.type === 'dynamic') note.dynamic = note.dynamic === currentTool.val ? null : currentTool.val;
        renderNote(note, trackEl);
        return;
    }

    draggedNote = { note, el, trackEl };
}

document.addEventListener('mousemove', (e) => {
    if (!draggedNote) return;
    
    const rect = draggedNote.trackEl.getBoundingClientRect();
    let x = Math.round((e.clientX - rect.left) / X_SNAP) * X_SNAP;
    let y = Math.round((e.clientY - rect.top) / Y_SNAP) * Y_SNAP;
    
    if (x < 20) x = 20;
    if (y < -30) y = -30;
    if (y > 120) y = 120;
    if (draggedNote.note.isRest) y = 40;

    draggedNote.note.x = x;
    draggedNote.note.y = y;
    renderNote(draggedNote.note, draggedNote.trackEl);
});

document.addEventListener('mouseup', () => { draggedNote = null; });

// --- Web Audio API Playback Engine ---
function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playScore() {
    initAudio();
    stopScore(false); 
    
    // Dynamically grab BPM from input field
    const currentBpm = document.getElementById('tempo-input').value || 100;
    const beatDuration = 60 / currentBpm;
    const now = audioCtx.currentTime;

    tracks.forEach(track => {
        track.notes.forEach(note => {
            if (note.isRest) return;

            const startTime = now + (note.x / PIXELS_PER_BEAT) * beatDuration;
            
            let dur = note.dur * beatDuration;
            if (note.articulation === '·') dur *= 0.4; 
            if (note.articulation === '>') dur *= 0.8; 
            
            // Calculate Pitch mapping to MIDI
            let midi = diatonicToMidi[note.y] || 60;
            
            // KEY SIGNATURE LOGIC: Get pitch class, add key signature offset
            const pitchClass = yToPitchClass(note.y);
            const keyOffset = keySignatures[currentKey][pitchClass] || 0;
            
            // Explicit accidentals override key signatures
            if (note.accidental === '♯') midi += 1;
            else if (note.accidental === '♭') midi -= 1;
            else if (note.accidental === '♮') midi = midi; // Natural ignores key offset
            else midi += keyOffset; // Apply key offset if no accidental
            
            const freq = 440 * Math.pow(2, (midi - 69) / 12);

            let volume = 0.5;
            if (note.dynamic === 'f' || note.articulation === '>') volume = 0.8;
            if (note.dynamic === 'p') volume = 0.2;

            playTone(freq, startTime, dur, volume);
        });
    });
}

function playTone(freq, startTime, duration, volume) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.05); 
    gain.gain.setValueAtTime(volume, startTime + duration - 0.05); 
    gain.gain.linearRampToValueAtTime(0, startTime + duration); 

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
}

function stopScore(closeCtx = true) {
    if (audioCtx && closeCtx) {
        audioCtx.close();
        audioCtx = null;
    }
}