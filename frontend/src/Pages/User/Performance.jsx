// working code


// import React from 'react';
// import { TrendingUp, Book, Clock, Award, AlertTriangle, Lightbulb } from 'lucide-react';

// const performanceData = {
//   scoreHistory: [20, 40, 60, 80],  // Example of scores over time (past 4 assessments)
//   dates: ['Jan', 'Feb', 'Mar', 'Apr'],  // Corresponding dates
//   strengths: [
//     "Strong understanding of React",
//     "Good communication skills",
//     "Passionate about learning"
//   ],
//   weaknesses: [
//     "Struggles with technical depth",
//     "Repetitive responses in interviews",
//     "Lack of concrete project examples"
//   ],
//   suggestions: [
//     "Focus on learning system design",
//     "Provide more detailed examples during interviews",
//     "Improve technical problem-solving skills"
//   ],
//   communication_skills: 3,
//   technical_knowledge: 2,
//   soft_skills: 4
// };

// // Custom card component for consistency
// const Card = ({ title, icon, children }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//       <div className="flex items-center mb-4">
//         {icon && <div className="mr-3">{icon}</div>}
//         <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
//       </div>
//       <div>{children}</div>
//     </div>
//   );
// };

// // Custom LineChart component using SVG
// const LineChart = ({ data, labels, height = 300 }) => {
//   const maxValue = Math.max(...data);
//   const paddingX = 40;
//   const paddingY = 40;
//   const chartWidth = 100 - (paddingX / 100) * 2;
//   const chartHeight = 100 - (paddingY / 100) * 2;
  
//   // Calculate points for the line
//   const points = data.map((value, index) => {
//     const x = paddingX / 2 + (index / (data.length - 1)) * chartWidth;
//     const y = 100 - (paddingY / 2 + (value / maxValue) * chartHeight);
//     return `${x},${y}`;
//   }).join(' ');
  
//   // Calculate points for the area fill
//   const areaPoints = [
//     `${paddingX / 2},${100 - paddingY / 2}`,
//     ...data.map((value, index) => {
//       const x = paddingX / 2 + (index / (data.length - 1)) * chartWidth;
//       const y = 100 - (paddingY / 2 + (value / maxValue) * chartHeight);
//       return `${x},${y}`;
//     }),
//     `${paddingX / 2 + chartWidth},${100 - paddingY / 2}`
//   ].join(' ');

//   return (
//     <div className="w-full h-full" style={{ height }}>
//       <svg viewBox="0 0 100 100" className="w-full h-full">
//         {/* Y-axis */}
//         <line 
//           x1={paddingX / 2} 
//           y1={paddingY / 2} 
//           x2={paddingX / 2} 
//           y2={100 - paddingY / 2} 
//           stroke="#e5e7eb" 
//           strokeWidth="0.5" 
//         />
        
//         {/* X-axis */}
//         <line 
//           x1={paddingX / 2} 
//           y1={100 - paddingY / 2} 
//           x2={paddingX / 2 + chartWidth} 
//           y2={100 - paddingY / 2} 
//           stroke="#e5e7eb" 
//           strokeWidth="0.5" 
//         />
        
//         {/* Y-axis labels */}
//         <text x="2" y={paddingY / 2} fill="#6b7280" fontSize="3.5" textAnchor="start" dominantBaseline="middle">100</text>
//         <text x="2" y={100 - paddingY / 2} fill="#6b7280" fontSize="3.5" textAnchor="start" dominantBaseline="middle">0</text>
        
//         {/* X-axis labels */}
//         {labels.map((label, index) => {
//           const x = paddingX / 2 + (index / (labels.length - 1)) * chartWidth;
//           return (
//             <text 
//               key={index} 
//               x={x} 
//               y={100 - paddingY / 2 + 4} 
//               fill="#6b7280" 
//               fontSize="3" 
//               textAnchor="middle" 
//               dominantBaseline="hanging"
//             >
//               {label}
//             </text>
//           );
//         })}
        
//         {/* Area fill */}
//         <polygon 
//           points={areaPoints} 
//           fill="rgba(79, 70, 229, 0.1)" 
//         />
        
//         {/* Line */}
//         <polyline 
//           points={points} 
//           fill="none" 
//           stroke="rgba(79, 70, 229, 1)" 
//           strokeWidth="0.8" 
//           strokeLinecap="round" 
//           strokeLinejoin="round" 
//         />
        
//         {/* Data points */}
//         {data.map((value, index) => {
//           const x = paddingX / 2 + (index / (data.length - 1)) * chartWidth;
//           const y = 100 - (paddingY / 2 + (value / maxValue) * chartHeight);
//           return (
//             <g key={index}>
//               <circle 
//                 cx={x} 
//                 cy={y} 
//                 r="1.5" 
//                 fill="white" 
//                 stroke="rgba(79, 70, 229, 1)" 
//                 strokeWidth="0.5" 
//               />
//               <circle 
//                 cx={x} 
//                 cy={y} 
//                 r="3" 
//                 fill="transparent" 
//                 stroke="transparent" 
//                 strokeWidth="0" 
//                 className="cursor-pointer"
//               >
//                 <title>{`${labels[index]}: ${value}`}</title>
//               </circle>
//             </g>
//           );
//         })}
//       </svg>
//     </div>
//   );
// };

// // Custom RadarChart component using SVG
// const RadarChart = ({ data, labels, height = 300 }) => {
//   const maxValue = 5; // Fixed max value for skills (1-5 scale)
//   const centerX = 50;
//   const centerY = 50;
//   const radius = 35;
  
//   // Calculate points for each axis
//   const getAxisPoint = (index, value) => {
//     const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
//     const x = centerX + radius * Math.cos(angle) * (value / maxValue);
//     const y = centerY + radius * Math.sin(angle) * (value / maxValue);
//     return { x, y };
//   };
  
//   // Calculate axis endpoints (for the grid)
//   const axisEndpoints = labels.map((_, index) => {
//     return getAxisPoint(index, maxValue);
//   });
  
//   // Calculate data points
//   const dataPoints = data.map((value, index) => {
//     return getAxisPoint(index, value);
//   });
  
//   // Create polygon points string
//   const polygonPoints = dataPoints.map(point => `${point.x},${point.y}`).join(' ');

//   return (
//     <div className="w-full h-full" style={{ height }}>
//       <svg viewBox="0 0 100 100" className="w-full h-full">
//         {/* Background grid circles */}
//         {[1, 2, 3, 4, 5].map((level) => (
//           <circle
//             key={level}
//             cx={centerX}
//             cy={centerY}
//             r={radius * (level / maxValue)}
//             fill="none"
//             stroke="rgba(203, 213, 225, 0.3)"
//             strokeWidth="0.2"
//           />
//         ))}
        
//         {/* Axis lines */}
//         {axisEndpoints.map((point, index) => (
//           <line
//             key={index}
//             x1={centerX}
//             y1={centerY}
//             x2={point.x}
//             y2={point.y}
//             stroke="rgba(203, 213, 225, 0.5)"
//             strokeWidth="0.2"
//           />
//         ))}
        
//         {/* Axis labels */}
//         {labels.map((label, index) => {
//           const point = getAxisPoint(index, maxValue * 1.15);
//           return (
//             <text
//               key={index}
//               x={point.x}
//               y={point.y}
//               fill="#374151"
//               fontSize="3.5"
//               textAnchor="middle"
//               dominantBaseline="middle"
//             >
//               {label}
//             </text>
//           );
//         })}
        
//         {/* Data polygon fill */}
//         <polygon
//           points={polygonPoints}
//           fill="rgba(16, 185, 129, 0.2)"
//           stroke="rgba(16, 185, 129, 0.8)"
//           strokeWidth="0.8"
//           strokeLinejoin="round"
//         />
        
//         {/* Data points */}
//         {dataPoints.map((point, index) => (
//           <circle
//             key={index}
//             cx={point.x}
//             cy={point.y}
//             r="1.5"
//             fill="rgba(16, 185, 129, 1)"
//             stroke="white"
//             strokeWidth="0.5"
//           >
//             <title>{`${labels[index]}: ${data[index]}/5`}</title>
//           </circle>
//         ))}
//       </svg>
//     </div>
//   );
// };

// // List item component for consistent styling
// const ListItem = ({ children }) => (
//   <li className="flex items-start mb-2.5">
//     <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2"></div>
//     <span className="text-gray-700">{children}</span>
//   </li>
// );

// // Display stats in a better format
// const SkillIndicator = ({ value, label }) => {
//   return (
//     <div className="mb-4">
//       <div className="flex justify-between mb-1">
//         <span className="text-sm font-medium text-gray-700">{label}</span>
//         <span className="text-sm font-medium text-gray-700">{value}/5</span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2">
//         <div
//           className="bg-indigo-600 h-2 rounded-full"
//           style={{ width: `${(value / 5) * 100}%` }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// const Performance = () => {
//   return (
//     <div className="bg-gray-50 min-h-screen py-8">
//       <div className="max-w-6xl mx-auto px-4">
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
//           <p className="text-gray-600 mt-2">Track your progress and identify areas for improvement</p>
//         </header>

//         <div className="grid md:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-medium text-gray-800">Current Score</h3>
//               <TrendingUp className="text-green-500" size={20} />
//             </div>
//             <div className="mt-2">
//               <span className="text-4xl font-bold text-gray-900">{performanceData.scoreHistory[performanceData.scoreHistory.length - 1]}</span>
//               <span className="text-sm text-gray-500 ml-2">/ 100</span>
//             </div>
//             <div className="text-green-500 text-sm font-medium mt-2">
//               +20 points from last assessment
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-medium text-gray-800">Assessments</h3>
//               <Book className="text-indigo-500" size={20} />
//             </div>
//             <div className="mt-2">
//               <span className="text-4xl font-bold text-gray-900">{performanceData.scoreHistory.length}</span>
//               <span className="text-sm text-gray-500 ml-2">completed</span>
//             </div>
//             <div className="text-gray-500 text-sm font-medium mt-2">
//               Last updated: April 2025
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-medium text-gray-800">Next Goal</h3>
//               <Clock className="text-orange-500" size={20} />
//             </div>
//             <div className="mt-2">
//               <span className="text-4xl font-bold text-gray-900">85</span>
//               <span className="text-sm text-gray-500 ml-2">target score</span>
//             </div>
//             <div className="text-orange-500 text-sm font-medium mt-2">
//               Due in 2 weeks
//             </div>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Line Chart: Performance Over Time */}
//           <Card title="Performance Trend" icon={<TrendingUp size={20} className="text-indigo-600" />}>
//             <LineChart 
//               data={performanceData.scoreHistory} 
//               labels={performanceData.dates} 
//               height={280}
//             />
//           </Card>

//           {/* Radar Chart: Skill Breakdown */}
//           <Card title="Skill Assessment" icon={<Award size={20} className="text-green-600" />}>
//             <RadarChart 
//               data={[
//                 performanceData.communication_skills,
//                 performanceData.technical_knowledge,
//                 performanceData.soft_skills
//               ]} 
//               labels={['Communication', 'Technical Knowledge', 'Soft Skills']}
//               height={280}
//             />
//           </Card>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6 mt-6">
//           {/* Skills Breakdown */}
//           <div>
//             <Card title="Skill Ratings" icon={<Award size={20} className="text-blue-600" />}>
//               <div className="mt-2">
//                 <SkillIndicator value={performanceData.communication_skills} label="Communication Skills" />
//                 <SkillIndicator value={performanceData.technical_knowledge} label="Technical Knowledge" />
//                 <SkillIndicator value={performanceData.soft_skills} label="Soft Skills" />
//               </div>
//             </Card>

//             {/* Strengths */}
//             <Card title="Key Strengths" icon={<Award size={20} className="text-green-600" />}>
//               <ul className="mt-2">
//                 {performanceData.strengths.map((strength, index) => (
//                   <ListItem key={index}>{strength}</ListItem>
//                 ))}
//               </ul>
//             </Card>
//           </div>

//           <div>
//             {/* Areas for Improvement */}
//             <Card title="Areas for Improvement" icon={<AlertTriangle size={20} className="text-amber-600" />}>
//               <ul className="mt-2">
//                 {performanceData.weaknesses.map((weakness, index) => (
//                   <ListItem key={index}>{weakness}</ListItem>
//                 ))}
//               </ul>
//             </Card>

//             {/* Recommendations */}
//             <Card title="Recommendations" icon={<Lightbulb size={20} className="text-blue-600" />}>
//               <ul className="mt-2">
//                 {performanceData.suggestions.map((suggestion, index) => (
//                   <ListItem key={index}>{suggestion}</ListItem>
//                 ))}
//               </ul>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Performance;




import React from 'react';
import { Check, XCircle, Zap, ChevronRight, Circle, AlertTriangle } from 'lucide-react';

const interviewData = [
  {
    score: 20,
    summary: "The candidate struggled to answer specific technical questions about their project, repeating the same generic response regardless of the question.",
    strengths: [],
    weaknesses: [
      "Inability to answer technical questions",
      "Repetition of generic responses",
      "Lack of concrete details"
    ],
    suggestions: [
      "Improve technical knowledge",
      "Practice answering technical questions"
    ],
    communication_skills: 2,
    technical_knowledge: 1,
    soft_skills: 2,
    red_flags: [
      "Major concerns about technical skills"
    ],
    categories: {
      "JavaScript": 2,
      "React": 1,
      "System Design": 1,
      "Problem Solving": 1,
      "Communication": 2
    }
  },
  {
    score: 80,
    summary: "The candidate presented a strong overview of their experience with React and Node.js, but faltered when asked about specific technical problems.",
    strengths: [
      "Strong React/Node.js knowledge",
      "Practical problem-solving",
      "Passion for learning"
    ],
    weaknesses: [
      "Lacks system design examples",
      "No complex problem-solving examples"
    ],
    suggestions: [
      "Provide concrete examples",
      "Practice behavioral questions"
    ],
    communication_skills: 4,
    technical_knowledge: 4,
    soft_skills: 4,
    red_flags: [],
    categories: {
      "JavaScript": 5,
      "React": 5,
      "System Design": 3,
      "Problem Solving": 4,
      "Communication": 4
    }
  },
  {
    score: 60,
    summary: "The candidate showed enthusiasm and confidence, but struggled to provide relevant answers to technical questions.",
    strengths: [
      "Enthusiastic",
      "Confident"
    ],
    weaknesses: [
      "Irrelevant technical answers",
      "No adaptability shown"
    ],
    suggestions: [
      "Prepare technical examples",
      "Develop learning skills"
    ],
    communication_skills: 3,
    technical_knowledge: 3,
    soft_skills: 3,
    red_flags: [
      "Inability to provide relevant technical answers"
    ],
    categories: {
      "JavaScript": 3,
      "React": 3,
      "System Design": 2,
      "Problem Solving": 3,
      "Communication": 3
    }
  }
];

const PerformanceRadialChart = ({ score }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? 'green' : score >= 50 ? 'yellow' : 'red';

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <circle
          className={`text-${color}-500`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold">{score}</span>
      </div>
    </div>
  );
};

const SkillRadarChart = ({ categories }) => {
  const skills = Object.keys(categories);
  const maxValue = 5;
  const angleSlice = (Math.PI * 2) / skills.length;

  return (
    <div className="w-full h-64">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background grid */}
        {[1, 2, 3, 4, 5].map((level) => (
          <polygon
            key={level}
            points={skills.map((_, i) => {
              const angle = i * angleSlice - Math.PI / 2;
              const x = 100 + Math.cos(angle) * (level * 20);
              const y = 100 + Math.sin(angle) * (level * 20);
              return `${x},${y}`;
            }).join(' ')}
            fill="rgba(59, 130, 246, 0.05)"
            stroke="rgba(59, 130, 246, 0.2)"
          />
        ))}

        {/* Skill axes */}
        {skills.map((skill, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const x = 100 + Math.cos(angle) * 100;
          const y = 100 + Math.sin(angle) * 100;
          return (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={x}
              y2={y}
              stroke="rgba(59, 130, 246, 0.3)"
            />
          );
        })}

        {/* Skill labels */}
        {skills.map((skill, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const x = 100 + Math.cos(angle) * 110;
          const y = 100 + Math.sin(angle) * 110;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-600"
            >
              {skill}
            </text>
          );
        })}

        {/* Data polygon */}
        <polygon
          points={skills.map((skill, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            const value = categories[skill];
            const x = 100 + Math.cos(angle) * (value * 20);
            const y = 100 + Math.sin(angle) * (value * 20);
            return `${x},${y}`;
          }).join(' ')}
          fill="rgba(99, 102, 241, 0.3)"
          stroke="rgba(99, 102, 241, 1)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

const ProgressBar = ({ value, max = 5, color = 'indigo' }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`bg-${color}-600 h-2.5 rounded-full`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const AssessmentDashboard = () => {
  const latestAssessment = interviewData[1];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Candidate Interview Analytics</h1>
          <p className="text-gray-600">Visual assessment of interview performance metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Performance Overview */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
            <div className="flex justify-between items-center mb-6">
              {interviewData.map((assessment, index) => (
                <div key={index} className="flex flex-col items-center">
                  <PerformanceRadialChart score={assessment.score} />
                  <span className="text-xs text-gray-500 mt-2">Assessment {index + 1}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>First Assessment</span>
              <span>Latest Assessment</span>
            </div>
          </div>

          {/* Skill Radar */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Skill Radar</h2>
            <SkillRadarChart categories={latestAssessment.categories} />
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Assessment Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Communication</span>
                  <span className="text-sm">{latestAssessment.communication_skills}/5</span>
                </div>
                <ProgressBar value={latestAssessment.communication_skills} color="blue" />
              </div>
              <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Technical</span>
                <span className="text-sm">{latestAssessment.technical_knowledge}/5</span>
              </div>
              <ProgressBar value={latestAssessment.technical_knowledge} color="yellow" />
            </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Soft Skills</span>
                  <span className="text-sm">{latestAssessment.soft_skills}/5</span>
                </div>
                <ProgressBar value={latestAssessment.soft_skills} color="green" />
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Strengths</h2>
            {latestAssessment.strengths.length > 0 ? (
              <div className="space-y-3">
                {latestAssessment.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1 mr-3">
                      <Circle className="w-4 h-4 text-green-500" fill="currentColor" />
                    </div>
                    <div className="text-gray-700">{strength}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No significant strengths identified</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Areas for Improvement</h2>
            <div className="space-y-3">
              {latestAssessment.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                  </div>
                  <div className="text-gray-700">{weakness}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Red Flags */}
        {latestAssessment.red_flags && latestAssessment.red_flags.length > 0 && (
          <div className="bg-red-50 rounded-xl shadow-md p-6 mb-6 border border-red-200">
            <h2 className="text-xl font-semibold mb-4 text-red-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Red Flags
            </h2>
            <div className="space-y-3">
              {latestAssessment.red_flags.map((flag, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="text-red-700">{flag}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Development Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestAssessment.suggestions.map((suggestion, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-2">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  <h3 className="font-medium">Suggestion {index + 1}</h3>
                </div>
                <p className="text-gray-600 text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Detailed Skill Assessment</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(latestAssessment.categories).map(([category, rating]) => (
                  <tr key={category}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rating}/5</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ProgressBar value={rating} max={5} color={
                        rating >= 4 ? 'green' : rating >= 3 ? 'yellow' : 'red'
                      } />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDashboard;