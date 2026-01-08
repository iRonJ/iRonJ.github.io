import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { ChevronRight, RotateCcw } from 'lucide-react';

// --- DATA PROCESSING & REGRESSION ---

const rawData = [
  { "congress": 41, "house": 2, "senate": 0 },
  { "congress": 42, "house": 5, "senate": 1 },
  { "congress": 43, "house": 7, "senate": 1 },
  { "congress": 44, "house": 7, "senate": 1 },
  { "congress": 45, "house": 3, "senate": 1 },
  { "congress": 46, "house": 2, "senate": 1 },
  { "congress": 47, "house": 2, "senate": 1 },
  { "congress": 48, "house": 2, "senate": 1 },
  { "congress": 49, "house": 2, "senate": 1 },
  { "congress": 50, "house": 3, "senate": 1 },
  { "congress": 51, "house": 1, "senate": 0 },
  { "congress": 52, "house": 1, "senate": 0 },
  { "congress": 53, "house": 1, "senate": 0 },
  { "congress": 54, "house": 1, "senate": 0 },
  { "congress": 55, "house": 1, "senate": 0 },
  { "congress": 56, "house": 1, "senate": 0 },
  { "congress": 57, "house": 1, "senate": 0 },
  { "congress": 58, "house": 1, "senate": 0 },
  { "congress": 59, "house": 0, "senate": 0 },
  { "congress": 60, "house": 0, "senate": 0 },
  { "congress": 61, "house": 0, "senate": 0 },
  { "congress": 62, "house": 0, "senate": 0 },
  { "congress": 63, "house": 0, "senate": 0 },
  { "congress": 64, "house": 0, "senate": 0 },
  { "congress": 65, "house": 0, "senate": 0 },
  { "congress": 66, "house": 0, "senate": 0 },
  { "congress": 67, "house": 0, "senate": 0 },
  { "congress": 68, "house": 0, "senate": 0 },
  { "congress": 69, "house": 1, "senate": 0 },
  { "congress": 70, "house": 1, "senate": 0 },
  { "congress": 71, "house": 1, "senate": 0 },
  { "congress": 72, "house": 1, "senate": 0 },
  { "congress": 73, "house": 1, "senate": 0 },
  { "congress": 74, "house": 1, "senate": 0 },
  { "congress": 75, "house": 1, "senate": 0 },
  { "congress": 76, "house": 1, "senate": 0 },
  { "congress": 77, "house": 1, "senate": 0 },
  { "congress": 78, "house": 2, "senate": 0 },
  { "congress": 79, "house": 2, "senate": 0 },
  { "congress": 80, "house": 2, "senate": 0 },
  { "congress": 81, "house": 2, "senate": 0 },
  { "congress": 82, "house": 2, "senate": 0 },
  { "congress": 83, "house": 3, "senate": 0 },
  { "congress": 84, "house": 4, "senate": 0 },
  { "congress": 85, "house": 4, "senate": 0 },
  { "congress": 86, "house": 4, "senate": 0 },
  { "congress": 87, "house": 5, "senate": 0 },
  { "congress": 88, "house": 6, "senate": 0 },
  { "congress": 89, "house": 6, "senate": 0 },
  { "congress": 90, "house": 10, "senate": 1 },
  { "congress": 91, "house": 13, "senate": 1 },
  { "congress": 92, "house": 16, "senate": 1 },
  { "congress": 93, "house": 17, "senate": 1 },
  { "congress": 94, "house": 17, "senate": 1 },
  { "congress": 95, "house": 18, "senate": 1 },
  { "congress": 96, "house": 19, "senate": 1 },
  { "congress": 97, "house": 22, "senate": 1 },
  { "congress": 98, "house": 21, "senate": 1 },
  { "congress": 99, "house": 23, "senate": 1 },
  { "congress": 100, "house": 25, "senate": 1 },
  { "congress": 101, "house": 28, "senate": 1 },
  { "congress": 102, "house": 40, "senate": 1 },
  { "congress": 103, "house": 43, "senate": 1 },
  { "congress": 104, "house": 41, "senate": 1 },
  { "congress": 105, "house": 39, "senate": 0 },
  { "congress": 106, "house": 39, "senate": 1 },
  { "congress": 107, "house": 40, "senate": 1 },
  { "congress": 108, "house": 42, "senate": 1 },
  { "congress": 109, "house": 46, "senate": 1 },
  { "congress": 110, "house": 41, "senate": 1 },
  { "congress": 111, "house": 45, "senate": 3 },
  { "congress": 112, "house": 44, "senate": 2 },
  { "congress": 113, "house": 47, "senate": 3 },
  { "congress": 114, "house": 49, "senate": 3 },
  { "congress": 115, "house": 56, "senate": 3 }
];

// 1. Calculate Linear Regression on Reconstruction Era (Congresses 41-44)
const trendSubset = rawData.slice(0, 4).map(d => ({
  x: d.congress,
  y: d.house + d.senate
}));

const n = trendSubset.length;
const sumX = trendSubset.reduce((a, b) => a + b.x, 0);
const sumY = trendSubset.reduce((a, b) => a + b.y, 0);
const sumXY = trendSubset.reduce((a, b) => a + (b.x * b.y), 0);
const sumXX = trendSubset.reduce((a, b) => a + (b.x * b.x), 0);

const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
const intercept = (sumY - slope * sumX) / n;

// 2. Process Full Data with Polynomial Error Margin
const processedData = rawData.map(d => {
  const realTotal = d.house + d.senate;
  
  // Calculate Base Trend
  const rawTrend = (slope * d.congress) + intercept;
  
  // Prevent negative values (which would be meaningless for representation count)
  const trend = Math.max(rawTrend, 0); 
  
  // Calculate Polynomial Error (Cone of Uncertainty)
  // We assume uncertainty grows as we get further from the training data (Congress 44)
  // Using a quadratic growth factor for the error margin
  const deltaX = Math.max(0, d.congress - 44);
  const errorGrowth = 0.015 * Math.pow(deltaX, 2); // Tuning factor for visual scale
  const baseError = 1.5; // Initial standard error approx
  
  const totalError = baseError + errorGrowth;

  return {
    congress: d.congress,
    year: 1789 + (d.congress * 2),
    real: realTotal,
    trend: trend,
    trendUpper: trend + totalError,
    trendLower: Math.max(0, trend - totalError), // Can't have negative reps
    gap: Math.max(0, trend - realTotal),
    // TrendRange is used for the band if supported, or we use separate areas
    trendRange: [Math.max(0, trend - totalError), trend + totalError] 
  };
});

const totalMissing = processedData.reduce((acc, curr) => acc + curr.gap, 0);

// --- NARRATIVE CONTENT ---

const phases = [
  {
    title: "The Rise and Fall",
    text: "During Reconstruction, African American representation surged. However, the introduction of Jim Crow laws systematically dismantled these gains, crashing representation to near zero for decades.",
    buttonLabel: "See the extrapolation",
    highlight: "reality"
  },
  {
    title: "What Could Have Been",
    text: "If the initial momentum of the Reconstruction era (Congresses 41-44) had not been violently interrupted, the trajectory of American politics would have looked fundamentally different. The gray band represents the margin of error for this projection, growing over time as history diverged from possibility.",
    buttonLabel: "Reveal the gap",
    highlight: "trend"
  },
  {
    title: "The Cost of Exclusion",
    text: `The shaded red area represents "Restorative Justice"—the representation lost to systemic suppression. This creates a cumulative deficit of ~${Math.round(totalMissing).toLocaleString()} "member-years". Political representation is a proxy for power; this gap mirrors the immense wealth and influence stripped from Black communities over a century of exclusion.`,
    buttonLabel: "Reset",
    highlight: "gap"
  }
];

// --- COMPONENT ---

export default function App() {
  const [phase, setPhase] = useState(0); 

  const handleNext = () => {
    if (phase < 2) setPhase(phase + 1);
    else setPhase(0);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-xl rounded-sm font-sans text-xs sm:text-sm z-50 max-w-[200px]">
          <p className="font-bold text-gray-900 mb-2 border-b pb-1">
            {data.congress}th Congress (~{data.year})
          </p>
          <div className="flex justify-between gap-4 mb-1">
            <span className="text-gray-600">Actual:</span>
            <span className="font-mono font-bold text-black">{data.real}</span>
          </div>
          {phase > 0 && (
            <>
               <div className="flex justify-between gap-4 mb-1 text-gray-500">
                <span>Projected:</span>
                <span className="font-mono">~{Math.round(data.trend)}</span>
              </div>
              <div className="flex justify-between gap-4 text-gray-400 text-xs italic mb-2">
                <span>Range:</span>
                <span className="font-mono">{Math.round(data.trendLower)} - {Math.round(data.trendUpper)}</span>
              </div>
            </>
          )}
          {phase === 2 && (
            <div className="flex justify-between gap-4 text-red-700 font-bold mt-2 pt-2 border-t border-dotted border-gray-300">
              <span>Deficit:</span>
              <span className="font-mono">{Math.round(data.gap)}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-900 font-serif selection:bg-red-100 flex flex-col items-center p-4 sm:p-6 lg:p-12">
      
      {/* HEADER */}
      <header className="max-w-3xl w-full mb-8 sm:mb-12 border-b border-gray-300 pb-6">
        <div className="flex items-center gap-2 mb-3 text-[10px] sm:text-xs font-sans tracking-widest text-gray-500 uppercase font-semibold">
          <span className="text-black">Historical Analysis</span>
          <span className="text-gray-300">/</span>
          <span>Regression Modeling</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold leading-none mb-4 tracking-tight text-black">
          The Missing Voices
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
          Visualizing 100 years of lost political capital and the cumulative impact of Jim Crow on African American representation.
        </p>
      </header>

      {/* VISUALIZATION */}
      <div className="w-full max-w-5xl relative mb-12">
        
        {/* Step Indicator */}
        <div className="absolute top-0 right-0 sm:right-auto sm:left-12 z-10 flex gap-1.5 translate-y-[-150%] sm:translate-y-4">
           {phases.map((_, i) => (
             <div 
                key={i} 
                className={`h-1.5 w-6 sm:w-8 rounded-full transition-all duration-700 ${i <= phase ? 'bg-gray-800' : 'bg-gray-200'}`}
             />
           ))}
        </div>

        <div className="h-[400px] sm:h-[550px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={processedData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <defs>
                <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
                  <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#e87878" strokeWidth="1" />
                </pattern>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e5e5" />
              
              <XAxis 
                dataKey="congress" 
                tick={{fill: '#888', fontSize: 11, fontFamily: 'sans-serif'}}
                axisLine={{ stroke: '#ccc' }}
                tickLine={false}
                minTickGap={30}
              />
              
              <YAxis 
                orientation="right"
                tick={{fill: '#888', fontSize: 11, fontFamily: 'sans-serif'}}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Seats in Congress', angle: -90, position: 'insideRight', offset: 10, fill: '#aaa', fontSize: 12 }}
              />
              
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#aaa', strokeDasharray: '4 4' }} />

              {/* LAYER ORDER STRATEGY:
                 1. Error Band (Upper Limit) - Lightest Gray
                 2. Error Band Mask (Lower Limit) - Background Color (Hides bottom of #1)
                 3. Gap Fill (Trend Mean) - Red (Only in Phase 2)
                 4. Reality Mask (Real Data) - Background Color (Hides bottom of #3)
                 5. Trend Line (Mean) - Dashed Line
                 6. Reality Line - Solid Black Line (Always visible on top)
              */}

              {/* LAYER 1: Uncertainty Cone (Upper) */}
              <Area
                type="monotone"
                dataKey="trendUpper"
                stroke="none"
                fill={phase > 0 ? "#f3f4f6" : "transparent"} // Tailwind gray-100
                animationDuration={1500}
                isAnimationActive={true}
              />

              {/* LAYER 2: Uncertainty Cone Mask (Lower) */}
              <Area
                type="monotone"
                dataKey="trendLower"
                stroke="none"
                fill="#fdfbf7" // Matches background
                fillOpacity={1}
                animationDuration={1500}
              />

              {/* LAYER 3: The "Restorative Justice" Gap (Trend Mean) */}
              <Area
                type="monotone"
                dataKey="trend"
                stroke="none"
                fill={phase === 2 ? "url(#diagonalHatch)" : "transparent"} 
                fillOpacity={phase === 2 ? 0.6 : 0}
                animationDuration={1000}
              />

              {/* LAYER 4: Reality Mask (Hides the bottom of the Gap, revealing only the difference) */}
              <Area 
                type="monotone" 
                dataKey="real" 
                stroke="none" 
                fill="#fdfbf7" 
                fillOpacity={1}
                animationDuration={1000}
              />

              {/* LAYER 5: The Trend Line (Mean) */}
              <Area
                type="monotone"
                dataKey="trend"
                stroke={phase > 0 ? "#9ca3af" : "transparent"}
                strokeDasharray="4 4"
                strokeWidth={2}
                fill="transparent"
                animationDuration={1500}
              />

              {/* LAYER 6: The Reality Line (Black) */}
              <Area
                type="monotone"
                dataKey="real"
                stroke="#1a1a1a"
                strokeWidth={3}
                fill="transparent"
                animationDuration={1000}
              />

              {/* Annotations - 44th Congress (1875-1877) */}
              <ReferenceLine x={44} stroke="#aaa" strokeDasharray="3 3">
                <Label 
                  value="1877: Reconstruction Peak" 
                  position="insideTopLeft" 
                  angle={-90} 
                  offset={15}
                  style={{ fill: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'sans-serif', fontWeight: 'bold' }} 
                />
              </ReferenceLine>
              
              {/* Annotations - 89th Congress (1965) */}
              <ReferenceLine x={89} stroke="#aaa" strokeDasharray="3 3">
                <Label 
                  value="1965: Civil Rights Era" 
                  position="insideTopLeft" 
                  angle={-90} 
                  offset={15}
                  style={{ fill: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'sans-serif', fontWeight: 'bold' }} 
                />
              </ReferenceLine>

              {phase > 0 && (
                <ReferenceLine x={115} stroke="none">
                  <Label 
                    value="Projected: ~160" 
                    position="top" 
                    offset={20}
                    style={{ fill: '#9ca3af', fontSize: '12px', fontWeight: 'bold' }} 
                  />
                </ReferenceLine>
              )}

            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CONTROLS & NARRATIVE */}
      <div className="max-w-2xl w-full bg-white border border-gray-200 p-6 sm:p-10 shadow-lg rounded-sm relative transition-all duration-500 z-20">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-200" />
        
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 font-sans text-black">{phases[phase].title}</h3>
            <p className="text-gray-700 leading-relaxed font-serif text-lg sm:text-xl">
              {phases[phase].text}
            </p>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button 
              onClick={handleNext}
              className="group flex items-center gap-3 px-8 py-3 bg-gray-900 text-white font-sans text-sm font-bold tracking-widest uppercase hover:bg-red-700 transition-all shadow-md rounded-sm"
            >
              {phase === 2 ? (
                <>
                  <RotateCcw size={16} /> Replay Analysis
                </>
              ) : (
                <>
                  {phases[phase].buttonLabel} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="max-w-3xl w-full mt-16 pb-12 flex flex-col gap-4 text-xs text-gray-500 font-sans border-t border-gray-200 pt-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p>
            <strong>Source:</strong>{' '}
            <a 
              href="https://www.everycrsreport.com/reports/RL30378.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-black transition-colors"
            >
              Congressional Research Service (Report RL30378)
            </a>
          </p>
          <p><strong>Methodology:</strong> Linear regression on Congress 41-44 with quadratic error scaling.</p>
        </div>
        <p className="opacity-70 leading-normal max-w-2xl">
          Note: The trend line is an extrapolation of the initial Reconstruction-era growth rate. The "gap" calculation is a simplified arithmetic difference intended for illustrative purposes to visualize the magnitude of lost representation.
        </p>
      </div>

    </div>
  );
}
