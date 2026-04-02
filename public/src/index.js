import { useState, useEffect } from "react";

const PHASES = {
  menstrual: {
    label: "Menstrual", color: "#C1506A", bg: "#fdf0f3", days: "Days 1–5", emoji: "🌑",
    tip: "She may need extra comfort, warmth, and rest. Bring her a heating pad or her favorite comfort food.",
    libidoLevel: 2,
    libidoLabel: "Variable / Low–Medium",
    libidoEmoji: "🌊",
    libidoSummary: "Libido varies widely during menstruation. Some women feel increased desire due to pelvic congestion and hormonal shifts, while others feel none at all.",
    libidoHusbandTip: "Don't assume — gently check in. If she's open to intimacy, orgasms can actually relieve cramps by releasing oxytocin and endorphins. Follow her lead completely.",
  },
  follicular: {
    label: "Follicular", color: "#E8875A", bg: "#fef6f0", days: "Days 6–13", emoji: "🌒",
    tip: "Energy is rising! Great time for fun dates, new experiences, and adventures together.",
    libidoLevel: 3,
    libidoLabel: "Rising",
    libidoEmoji: "📈",
    libidoSummary: "Estrogen climbs steadily, boosting mood, energy, and interest in connection. She may become more flirtatious and open to intimacy as the week progresses.",
    libidoHusbandTip: "Plan romantic time together — she's likely more receptive to initiating or responding to closeness. Focus on quality time and building emotional connection.",
  },
  ovulation: {
    label: "Ovulation", color: "#5BAD8F", bg: "#f0faf5", days: "Days 14–16", emoji: "🌕",
    tip: "Peak energy and mood. She'll likely feel her best — plan something special!",
    libidoLevel: 5,
    libidoLabel: "Peak 🔥",
    libidoEmoji: "🔥",
    libidoSummary: "This is her highest-desire window. A surge in estrogen and a spike in testosterone drive peak libido. She may feel more confident, attractive, and interested in sex.",
    libidoHusbandTip: "This is a naturally high-connection window. She's likely at her most interested in intimacy — be present, attentive, and romantic. If you're trying to conceive, this is the key window.",
  },
  luteal: {
    label: "Luteal", color: "#7B6FAD", bg: "#f5f3fb", days: "Days 17–28", emoji: "🌘",
    tip: "She may feel more sensitive or tired. Be patient, check in often, and reduce her mental load.",
    libidoLevel: 2,
    libidoLabel: "Declining",
    libidoEmoji: "📉",
    libidoSummary: "Progesterone rises and estrogen drops, often reducing desire and increasing the need for emotional safety and comfort over physical intimacy.",
    libidoHusbandTip: "Prioritize emotional intimacy — cuddles, words of affirmation, and acts of service matter more than ever now. Don't take lower interest personally; it's hormonal, not relational.",
  },
};

function getPhase(dayOfCycle) {
  if (dayOfCycle <= 5) return "menstrual";
  if (dayOfCycle <= 13) return "follicular";
  if (dayOfCycle <= 16) return "ovulation";
  return "luteal";
}

function getDayOfCycle(lastPeriodDate, cycleLength) {
  const today = new Date();
  const start = new Date(lastPeriodDate);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return ((diff % cycleLength) + cycleLength) % cycleLength + 1;
}

function getDaysUntilNext(dayOfCycle, cycleLength) {
  return cycleLength - dayOfCycle + 1;
}

function getPMSWarning(dayOfCycle, cycleLength) {
  const daysLeft = cycleLength - dayOfCycle;
  if (daysLeft <= 5 && daysLeft >= 0) return daysLeft;
  return null;
}

const EMOJI_MOODS = ["😊", "😐", "😔", "😤", "😴", "🥰", "😰", "🤗"];
const SYMPTOMS = ["Cramps", "Bloating", "Headache", "Mood swings", "Fatigue", "Cravings", "Back pain", "Tender breasts"];

export default function CycleTracker() {
  const [lastPeriod, setLastPeriod] = useState(() => localStorage.getItem("lp") || "");
  const [cycleLength, setCycleLength] = useState(() => parseInt(localStorage.getItem("cl") || "28"));
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("notes") || "[]"); } catch { return []; }
  });
  const [newNote, setNewNote] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [tab, setTab] = useState("home");
  const [saved, setSaved] = useState(false);
  const [setupDone, setSetupDone] = useState(() => !!localStorage.getItem("lp"));

  useEffect(() => {
    localStorage.setItem("lp", lastPeriod);
    localStorage.setItem("cl", cycleLength);
  }, [lastPeriod, cycleLength]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const dayOfCycle = lastPeriod ? getDayOfCycle(lastPeriod, cycleLength) : null;
  const phase = dayOfCycle ? getPhase(dayOfCycle) : null;
  const phaseInfo = phase ? PHASES[phase] : null;
  const daysUntilNext = dayOfCycle ? getDaysUntilNext(dayOfCycle, cycleLength) : null;
  const pmsWarning = dayOfCycle ? getPMSWarning(dayOfCycle, cycleLength) : null;
  const cycleProgress = dayOfCycle ? Math.round((dayOfCycle / cycleLength) * 100) : 0;

  function saveNote() {
    if (!newNote.trim() && !selectedMood && selectedSymptoms.length === 0) return;
    const entry = {
      date: new Date().toLocaleDateString(),
      note: newNote,
      mood: selectedMood,
      symptoms: [...selectedSymptoms],
    };
    setNotes([entry, ...notes.slice(0, 19)]);
    setNewNote("");
    setSelectedMood("");
    setSelectedSymptoms([]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleSymptom(s) {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  if (!setupDone) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fdf0f3 0%, #f5f3fb 50%, #f0faf5 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", padding: "20px" }}>
        <div style={{ background: "white", borderRadius: "24px", padding: "40px", maxWidth: "420px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌸</div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#2d1b33", margin: 0, letterSpacing: "-0.5px" }}>Cycle Companion</h1>
            <p style={{ color: "#8a7a8f", marginTop: "8px", fontSize: "15px", lineHeight: "1.5" }}>A loving husband's guide to supporting his wife through every phase</p>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4a3550", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>First day of her last period</label>
            <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "2px solid #e8ddef", fontSize: "16px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#2d1b33" }} />
          </div>
          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4a3550", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Average cycle length: <span style={{ color: "#C1506A" }}>{cycleLength} days</span></label>
            <input type="range" min={21} max={35} value={cycleLength} onChange={e => setCycleLength(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#C1506A" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#b0a0b8", marginTop: "4px" }}>
              <span>21 days</span><span>35 days</span>
            </div>
          </div>
          <button onClick={() => { if (lastPeriod) setSetupDone(true); }}
            style={{ width: "100%", padding: "14px", background: lastPeriod ? "linear-gradient(135deg, #C1506A, #7B6FAD)" : "#ddd", color: "white", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "700", cursor: lastPeriod ? "pointer" : "not-allowed", letterSpacing: "0.3px", fontFamily: "inherit" }}>
            Start Supporting Her 💕
          </button>
        </div>
      </div>
    );
  }

  const phaseColor = phaseInfo?.color || "#C1506A";
  const phaseBg = phaseInfo?.bg || "#fdf0f3";

  return (
    <div style={{ minHeight: "100vh", background: phaseBg, fontFamily: "'Georgia', serif", transition: "background 0.6s ease" }}>
      <div style={{ background: "white", padding: "20px 24px 0", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#2d1b33", margin: 0 }}>🌸 Cycle Companion</h1>
              <p style={{ fontSize: "13px", color: "#b0a0b8", margin: "2px 0 0" }}>for the husband who cares</p>
            </div>
            <button onClick={() => setSetupDone(false)} style={{ background: "none", border: "1px solid #e8ddef", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", color: "#8a7a8f", cursor: "pointer", fontFamily: "inherit" }}>⚙️ Settings</button>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {[["home", "Today"], ["calendar", "Calendar"], ["notes", "Notes"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ flex: 1, padding: "10px", background: tab === id ? phaseColor : "transparent", color: tab === id ? "white" : "#8a7a8f", border: "none", borderRadius: "10px 10px 0 0", fontSize: "14px", fontWeight: tab === id ? "700" : "500", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>

        {tab === "home" && phase && (
          <div>
            {pmsWarning !== null && pmsWarning <= 5 && (
              <div style={{ background: "linear-gradient(135deg, #7B6FAD20, #C1506A20)", border: "2px solid #7B6FAD40", borderRadius: "16px", padding: "14px 18px", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "24px" }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: "700", color: "#4a3550", fontSize: "14px" }}>Period arriving in ~{pmsWarning} day{pmsWarning !== 1 ? "s" : ""}!</div>
                  <div style={{ color: "#7B6FAD", fontSize: "13px", marginTop: "2px" }}>PMS may be in full effect. Extra patience and love go a long way right now.</div>
                </div>
              </div>
            )}

            <div style={{ background: "white", borderRadius: "24px", padding: "28px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", marginBottom: "20px", border: `3px solid ${phaseColor}20`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "100px", opacity: 0.06 }}>{phaseInfo.emoji}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "36px" }}>{phaseInfo.emoji}</span>
                <div>
                  <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: phaseColor, fontWeight: "700" }}>{phaseInfo.label} Phase</div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#2d1b33" }}>Day {dayOfCycle} of {cycleLength}</div>
                </div>
              </div>
              <div style={{ background: "#f0eaf4", borderRadius: "999px", height: "8px", marginBottom: "16px", overflow: "hidden" }}>
                <div style={{ background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}99)`, width: `${cycleProgress}%`, height: "100%", borderRadius: "999px" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#b0a0b8", marginBottom: "20px" }}>
                <span>{phaseInfo.days}</span>
                <span>Next period in ~{daysUntilNext} days</span>
              </div>
              <div style={{ background: `${phaseColor}12`, borderLeft: `4px solid ${phaseColor}`, borderRadius: "0 12px 12px 0", padding: "14px 16px" }}>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: phaseColor, fontWeight: "700", marginBottom: "6px" }}>💡 Husband Tip</div>
                <div style={{ color: "#4a3550", fontSize: "14px", lineHeight: "1.6" }}>{phaseInfo.tip}</div>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "20px", padding: "22px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#4a3550", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>💞 Intimacy & Desire</div>
              <div style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", color: "#4a3550", fontWeight: "600" }}>Typical desire level</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: phaseColor }}>{phaseInfo.libidoEmoji} {phaseInfo.libidoLabel}</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{ flex: 1, height: "10px", borderRadius: "999px", background: n <= phaseInfo.libidoLevel ? phaseColor : "#f0eaf4" }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#c0b0c8", marginTop: "4px" }}>
                  <span>Lower</span><span>Higher</span>
                </div>
              </div>
              <p style={{ fontSize: "14px", color: "#6a5a70", lineHeight: "1.65", margin: "0 0 14px" }}>{phaseInfo.libidoSummary}</p>
              <div style={{ background: `${phaseColor}10`, borderLeft: `4px solid ${phaseColor}`, borderRadius: "0 12px 12px 0", padding: "13px 15px" }}>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: phaseColor, fontWeight: "700", marginBottom: "5px" }}>💡 How to Show Up</div>
                <div style={{ color: "#4a3550", fontSize: "14px", lineHeight: "1.6" }}>{phaseInfo.libidoHusbandTip}</div>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#4a3550", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Desire Through the Cycle</div>
              {Object.entries(PHASES).map(([key, info]) => (
                <div key={key} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                    <span style={{ fontSize: "16px" }}>{info.emoji}</span>
                    <span style={{ fontSize: "13px", fontWeight: phase === key ? "700" : "500", color: phase === key ? info.color : "#4a3550", flex: 1 }}>{info.label}</span>
                    <span style={{ fontSize: "12px", color: info.color, fontWeight: "600" }}>{info.libidoEmoji} {info.libidoLabel}</span>
                  </div>
                  <div style={{ display: "flex", gap: "4px", paddingLeft: "26px" }}>
                    {[1,2,3,4,5].map(n => (
                      <div key={n} style={{ flex: 1, height: "6px", borderRadius: "999px", background: n <= info.libidoLevel ? info.color : "#f0eaf4" }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#4a3550", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Her Cycle at a Glance</div>
              {Object.entries(PHASES).map(([key, info]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #f5f0f8" }}>
                  <span style={{ fontSize: "20px" }}>{info.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: phase === key ? "700" : "500", color: phase === key ? info.color : "#4a3550", fontSize: "14px" }}>{info.label}</div>
                    <div style={{ fontSize: "12px", color: "#b0a0b8" }}>{info.days}</div>
                  </div>
                  {phase === key && <div style={{ background: info.color, color: "white", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "700" }}>NOW</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "calendar" && (
          <div>
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#4a3550", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "20px" }}>Upcoming 35 Days</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                  <div key={d} style={{ textAlign: "center", fontSize: "11px", color: "#b0a0b8", fontWeight: "700", padding: "4px 0" }}>{d}</div>
                ))}
                {(() => {
                  const today = new Date();
                  const firstDow = today.getDay();
                  const cells = [];
                  for (let i = 0; i < firstDow; i++) cells.push(<div key={"blank"+i} />);
                  for (let d = 0; d < 35; d++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + d);
                    const start = new Date(lastPeriod);
                    const diff = Math.floor((date - start) / (1000 * 60 * 60 * 24));
                    const dayNum = ((diff % cycleLength) + cycleLength) % cycleLength + 1;
                    const p = getPhase(dayNum);
                    const isToday = d === 0;
                    cells.push(
                      <div key={d} style={{ textAlign: "center", padding: "6px 2px", borderRadius: "8px", background: isToday ? PHASES[p].color : `${PHASES[p].color}22`, color: isToday ? "white" : PHASES[p].color, fontWeight: isToday ? "700" : "500", fontSize: "13px", border: isToday ? `2px solid ${PHASES[p].color}` : "2px solid transparent" }}>
                        {date.getDate()}
                      </div>
                    );
                  }
                  return cells;
                })()}
              </div>
            </div>
            <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#4a3550", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>Legend</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {Object.entries(PHASES).map(([key, info]) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: info.color }} />
                    <span style={{ fontSize: "13px", color: "#4a3550" }}>{info.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div>
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#4a3550", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Log Today</div>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "13px", color: "#8a7a8f", marginBottom: "8px" }}>Her mood today</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {EMOJI_MOODS.map(m => (
                    <button key={m} onClick={() => setSelectedMood(selectedMood === m ? "" : m)}
                      style={{ fontSize: "24px", background: selectedMood === m ? `${phaseColor}20` : "transparent", border: selectedMood === m ? `2px solid ${phaseColor}` : "2px solid #f0eaf4", borderRadius: "10px", padding: "6px", cursor: "pointer" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "13px", color: "#8a7a8f", marginBottom: "8px" }}>Symptoms noticed</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {SYMPTOMS.map(s => (
                    <button key={s} onClick={() => toggleSymptom(s)}
                      style={{ padding: "6px 12px", borderRadius: "20px", background: selectedSymptoms.includes(s) ? phaseColor : "transparent", color: selectedSymptoms.includes(s) ? "white" : "#4a3550", border: `2px solid ${selectedSymptoms.includes(s) ? phaseColor : "#e8ddef"}`, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Any notes to remember? How can you support her better today?"
                style={{ width: "100%", border: "2px solid #e8ddef", borderRadius: "12px", padding: "12px", fontSize: "14px", fontFamily: "inherit", resize: "vertical", minHeight: "80px", outline: "none", color: "#2d1b33", boxSizing: "border-box" }} />
              <button onClick={saveNote}
                style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${phaseColor}, #7B6FAD)`, color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", marginTop: "12px" }}>
                {saved ? "✓ Saved!" : "Save Entry"}
              </button>
            </div>
            {notes.length > 0 && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#4a3550", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px", paddingLeft: "4px" }}>Past Entries</div>
                {notes.map((n, i) => (
                  <div key={i} style={{ background: "white", borderRadius: "16px", padding: "16px 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: "10px", borderLeft: `4px solid ${phaseColor}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "13px", color: "#b0a0b8" }}>{n.date}</span>
                      {n.mood && <span style={{ fontSize: "22px" }}>{n.mood}</span>}
                    </div>
                    {n.symptoms?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                        {n.symptoms.map(s => <span key={s} style={{ background: `${phaseColor}15`, color: phaseColor, padding: "2px 8px", borderRadius: "20px", fontSize: "12px" }}>{s}</span>)}
                      </div>
                    )}
                    {n.note && <div style={{ fontSize: "14px", color: "#4a3550", lineHeight: "1.5" }}>{n.note}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
