import React from 'react';
import { TrendingUp, Book, Clock, AlertTriangle, Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Card component with hover effect
const Card = ({ title, icon, children, accentColor = "indigo" }) => {
  const colorClasses = {
    indigo: "text-indigo-600",
    green: "text-green-600",
    amber: "text-amber-600",
    red: "text-red-600"
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-4">
        {icon && <div className={`mr-3 ${colorClasses[accentColor]}`}>{icon}</div>}
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon, trend, color = "indigo" }) => {
  const colorMap = {
    indigo: "text-indigo-500",
    green: "text-green-500",
    orange: "text-orange-500"
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        {icon && <div className={colorMap[color]}>{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline">
        <span className="text-4xl font-bold text-gray-900">{value}</span>
        {subtitle && <span className="text-sm text-gray-500 ml-2">{subtitle}</span>}
      </div>
      {trend && (
        <div className={`${colorMap[color]} text-sm font-medium mt-2`}>
          {trend}
        </div>
      )}
    </div>
  );
};

// Line Chart component
const LineChart = ({ data, labels, height = 300 }) => {
  // Get max value for scaling
  const maxValue = Math.max(...data);
  const chartHeight = 200;
  const chartWidth = 400;
  const padding = 40;
  
  // Calculate positions
  const points = data.map((value, index) => {
    const x = padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
    const y = chartHeight - padding - ((value / maxValue) * (chartHeight - 2 * padding));
    return { x, y };
  });
  
  const pathData = points.reduce((path, point, i) => {
    return path + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`);
  }, "");
  
  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" style={{ height }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
          const y = chartHeight - padding - tick * (chartHeight - 2 * padding);
          return (
            <g key={i}>
              <line 
                x1={padding} 
                y1={y} 
                x2={chartWidth - padding} 
                y2={y} 
                stroke="#e5e7eb" 
                strokeWidth="1"
              />
              <text 
                x={padding - 5} 
                y={y} 
                fontSize="10" 
                textAnchor="end" 
                dominantBaseline="middle" 
                fill="#6b7280"
              >
                {Math.round(tick * maxValue)}
              </text>
            </g>
          );
        })}

        {/* X-axis labels - rotated vertically */}
        {labels.map((label, i) => {
          const x = padding + (i * (chartWidth - 2 * padding)) / (labels.length - 1);
          return (
            <g key={i} transform={`translate(${x},${chartHeight - padding + 5}) rotate(45)`}>
              <text 
                x={0} 
                y={0} 
                fontSize="10" 
                textAnchor="start" 
                fill="#6b7280"
              >
                {label}
              </text>
            </g>
          );
        })}
        
        {/* Line */}
        <path 
          d={pathData}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle 
              cx={point.x} 
              cy={point.y} 
              r="4" 
              fill="white" 
              stroke="#4f46e5" 
              strokeWidth="2"
            >
              <title>{`${labels[i]}: ${data[i]}`}</title>
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
};

// Pie Chart component
const PieChart = ({ data, labels, colors, height = 250 }) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  let cumulativePercent = 0;

  return (
    <div className="w-full h-full" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Slices */}
        {data.map((value, index) => {
          const percent = (value / total) * 100;
          const startX = 50 + 40 * Math.cos(2 * Math.PI * cumulativePercent / 100 - Math.PI / 2);
          const startY = 50 + 40 * Math.sin(2 * Math.PI * cumulativePercent / 100 - Math.PI / 2);
          cumulativePercent += percent;
          const endX = 50 + 40 * Math.cos(2 * Math.PI * cumulativePercent / 100 - Math.PI / 2);
          const endY = 50 + 40 * Math.sin(2 * Math.PI * cumulativePercent / 100 - Math.PI / 2);
          const largeArcFlag = percent > 50 ? 1 : 0;

          return (
            <g key={index}>
              <path
                d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                fill={colors[index]}
                stroke="white"
                strokeWidth="1"
                className="transition-opacity duration-300 hover:opacity-80"
              >
                <title>{`${labels[index]}: ${value} (${Math.round(percent)}%)`}</title>
              </path>
              {percent >= 10 && (
                <text
                  x={50 + 25 * Math.cos(2 * Math.PI * (cumulativePercent - percent / 2) / 100 - Math.PI / 2)}
                  y={50 + 25 * Math.sin(2 * Math.PI * (cumulativePercent - percent / 2) / 100 - Math.PI / 2)}
                  fill="white"
                  fontSize="4"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontWeight="bold"
                >
                  {`${Math.round(percent)}%`}
                </text>
              )}
            </g>
          );
        })}
        <circle cx="50" cy="50" r="25" fill="white" />
        <text x="50" y="48" fill="#4B5563" fontSize="8" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
          {total}
        </text>
        <text x="50" y="55" fill="#6B7280" fontSize="3" textAnchor="middle" dominantBaseline="middle">
          TOTAL ITEMS
        </text>
      </svg>
      
      {/* Legend - improved layout */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {labels.map((label, index) => (
          <div key={index} className="flex items-center px-3 py-1 bg-gray-100 rounded-full">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: colors[index] }}
            ></div>
            <span className="text-xs text-gray-700 whitespace-nowrap">
              {label} ({data[index]})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// List item component with icons
const ListItem = ({ children, type }) => {
  const iconMap = {
    strength: <CheckCircle size={16} className="text-green-500 flex-shrink-0" />,
    weakness: <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />,
    redFlag: <XCircle size={16} className="text-red-500 flex-shrink-0" />
  };

  return (
    <li className="flex items-start mb-3 gap-2">
      {iconMap[type]}
      <span className="text-gray-700">{children}</span>
    </li>
  );
};

// Main Dashboard Component
const Performance = ({ interviewData }) => {
  // Process the interview data
  const assessments = interviewData.interview_score || [];
  
  // Get all scores in chronological order
  const scoreHistory = assessments.map(assessment => assessment.score);
  
  // Get dates for the chart (using assessment dates or simple numbering if not available)
  const dates = assessments.map((_, index) => `Test ${index + 1}`);
  
  // Get current score (most recent)
  const currentScore = scoreHistory.length > 0 ? scoreHistory[scoreHistory.length - 1] : 0;
  
  // Calculate score difference
  const scoreDifference = scoreHistory.length > 1 
    ? currentScore - scoreHistory[scoreHistory.length - 2] 
    : 0;
  
  // Next goal is current score + 5
  const nextGoal = currentScore + 5;
  
  // Count all strengths, weaknesses, and red flags
  let totalStrengths = 0;
  let totalWeaknesses = 0;
  let totalRedFlags = 0;
  
  const allStrengths = [];
  const allWeaknesses = [];
  const allRedFlags = [];
  
  assessments.forEach(assessment => {
    totalStrengths += assessment.strengths?.length || 0;
    totalWeaknesses += assessment.weaknesses?.length || 0;
    totalRedFlags += assessment.red_flags?.length || 0;
    
    if (assessment.strengths) allStrengths.push(...assessment.strengths);
    if (assessment.weaknesses) allWeaknesses.push(...assessment.weaknesses);
    if (assessment.red_flags) allRedFlags.push(...assessment.red_flags);
  });

  // Data for pie chart
  const pieData = {
    labels: ['Strengths', 'Weaknesses', 'Red Flags'],
    data: [totalStrengths, totalWeaknesses, totalRedFlags],
    colors: ['#10B981', '#F59E0B', '#EF4444']
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your progress and identify areas for improvement</p>
        </header>

        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Current Score"
            value={currentScore}
            subtitle="/ 100"
            icon={<TrendingUp size={20} />}
            trend={`${scoreDifference >= 0 ? '+' : ''}${scoreDifference} points from last assessment`}
            color={scoreDifference >= 0 ? "green" : "orange"}
          />
          
          <StatCard
            title="Assessments"
            value={assessments.length}
            subtitle="completed"
            icon={<Book size={20} />}
            trend={`Total feedback items: ${totalStrengths + totalWeaknesses + totalRedFlags}`}
            color="indigo"
          />
          
          <StatCard
            title="Next Goal"
            value={nextGoal}
            subtitle="target score"
            icon={<Clock size={20} />}
            trend={`${nextGoal - currentScore} points to reach goal`}
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card title="Performance Trend" icon={<TrendingUp size={20} />}>
            <LineChart 
              data={scoreHistory} 
              labels={dates} 
              height={280}
            />
          </Card>

          <Card title="Feedback Distribution" icon={<Award size={20} />}>
            <PieChart 
              data={pieData.data} 
              labels={pieData.labels} 
              colors={pieData.colors}
              height={280}
            />
          </Card>
        </div>

        {/* Feedback Lists Row */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Strengths" icon={<Award size={20} />} accentColor="green">
            <ul className="mt-3">
              {allStrengths.map((strength, index) => (
                <ListItem key={index} type="strength">{strength}</ListItem>
              ))}
              {allStrengths.length === 0 && (
                <p className="text-gray-500">No strengths identified yet</p>
              )}
            </ul>
          </Card>

          <Card title="Weaknesses" icon={<AlertTriangle size={20} />} accentColor="amber">
            <ul className="mt-3">
              {allWeaknesses.map((weakness, index) => (
                <ListItem key={index} type="weakness">{weakness}</ListItem>
              ))}
              {allWeaknesses.length === 0 && (
                <p className="text-gray-500">No weaknesses identified yet</p>
              )}
            </ul>
          </Card>

          <Card title="Red Flags" icon={<AlertTriangle size={20} />} accentColor="red">
            <ul className="mt-3">
              {allRedFlags.map((flag, index) => (
                <ListItem key={index} type="redFlag">{flag}</ListItem>
              ))}
              {allRedFlags.length === 0 && (
                <p className="text-gray-500">No red flags identified yet</p>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Performance;

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









// import React from 'react';
// import { Check, XCircle, Zap, ChevronRight, Circle, AlertTriangle } from 'lucide-react';

// const interviewData = [
//   {
//     score: 20,
//     summary: "The candidate struggled to answer specific technical questions about their project, repeating the same generic response regardless of the question.",
//     strengths: [],
//     weaknesses: [
//       "Inability to answer technical questions",
//       "Repetition of generic responses",
//       "Lack of concrete details"
//     ],
//     suggestions: [
//       "Improve technical knowledge",
//       "Practice answering technical questions"
//     ],
//     communication_skills: 2,
//     technical_knowledge: 1,
//     soft_skills: 2,
//     red_flags: [
//       "Major concerns about technical skills"
//     ],
//     categories: {
//       "JavaScript": 2,
//       "React": 1,
//       "System Design": 1,
//       "Problem Solving": 1,
//       "Communication": 2
//     }
//   },
//   {
//     score: 80,
//     summary: "The candidate presented a strong overview of their experience with React and Node.js, but faltered when asked about specific technical problems.",
//     strengths: [
//       "Strong React/Node.js knowledge",
//       "Practical problem-solving",
//       "Passion for learning"
//     ],
//     weaknesses: [
//       "Lacks system design examples",
//       "No complex problem-solving examples"
//     ],
//     suggestions: [
//       "Provide concrete examples",
//       "Practice behavioral questions"
//     ],
//     communication_skills: 4,
//     technical_knowledge: 4,
//     soft_skills: 4,
//     red_flags: [],
//     categories: {
//       "JavaScript": 5,
//       "React": 5,
//       "System Design": 3,
//       "Problem Solving": 4,
//       "Communication": 4
//     }
//   },
//   {
//     score: 60,
//     summary: "The candidate showed enthusiasm and confidence, but struggled to provide relevant answers to technical questions.",
//     strengths: [
//       "Enthusiastic",
//       "Confident"
//     ],
//     weaknesses: [
//       "Irrelevant technical answers",
//       "No adaptability shown"
//     ],
//     suggestions: [
//       "Prepare technical examples",
//       "Develop learning skills"
//     ],
//     communication_skills: 3,
//     technical_knowledge: 3,
//     soft_skills: 3,
//     red_flags: [
//       "Inability to provide relevant technical answers"
//     ],
//     categories: {
//       "JavaScript": 3,
//       "React": 3,
//       "System Design": 2,
//       "Problem Solving": 3,
//       "Communication": 3
//     }
//   }
// ];

// const PerformanceRadialChart = ({ score }) => {
//   const circumference = 2 * Math.PI * 40;
//   const strokeDashoffset = circumference - (score / 100) * circumference;
//   const color = score >= 70 ? 'green' : score >= 50 ? 'yellow' : 'red';

//   return (
//     <div className="relative w-24 h-24">
//       <svg className="w-full h-full" viewBox="0 0 100 100">
//         <circle
//           className="text-gray-200"
//           strokeWidth="8"
//           stroke="currentColor"
//           fill="transparent"
//           r="40"
//           cx="50"
//           cy="50"
//         />
//         <circle
//           className={`text-${color}-500`}
//           strokeWidth="8"
//           strokeDasharray={circumference}
//           strokeDashoffset={strokeDashoffset}
//           strokeLinecap="round"
//           stroke="currentColor"
//           fill="transparent"
//           r="40"
//           cx="50"
//           cy="50"
//           transform="rotate(-90 50 50)"
//         />
//       </svg>
//       <div className="absolute inset-0 flex items-center justify-center">
//         <span className="text-xl font-bold">{score}</span>
//       </div>
//     </div>
//   );
// };

// const SkillRadarChart = ({ categories }) => {
//   const skills = Object.keys(categories);
//   const maxValue = 5;
//   const angleSlice = (Math.PI * 2) / skills.length;

//   return (
//     <div className="w-full h-64">
//       <svg viewBox="0 0 200 200" className="w-full h-full">
//         {/* Background grid */}
//         {[1, 2, 3, 4, 5].map((level) => (
//           <polygon
//             key={level}
//             points={skills.map((_, i) => {
//               const angle = i * angleSlice - Math.PI / 2;
//               const x = 100 + Math.cos(angle) * (level * 20);
//               const y = 100 + Math.sin(angle) * (level * 20);
//               return `${x},${y}`;
//             }).join(' ')}
//             fill="rgba(59, 130, 246, 0.05)"
//             stroke="rgba(59, 130, 246, 0.2)"
//           />
//         ))}

//         {/* Skill axes */}
//         {skills.map((skill, i) => {
//           const angle = i * angleSlice - Math.PI / 2;
//           const x = 100 + Math.cos(angle) * 100;
//           const y = 100 + Math.sin(angle) * 100;
//           return (
//             <line
//               key={i}
//               x1="100"
//               y1="100"
//               x2={x}
//               y2={y}
//               stroke="rgba(59, 130, 246, 0.3)"
//             />
//           );
//         })}

//         {/* Skill labels */}
//         {skills.map((skill, i) => {
//           const angle = i * angleSlice - Math.PI / 2;
//           const x = 100 + Math.cos(angle) * 110;
//           const y = 100 + Math.sin(angle) * 110;
//           return (
//             <text
//               key={i}
//               x={x}
//               y={y}
//               textAnchor="middle"
//               dominantBaseline="middle"
//               className="text-xs fill-gray-600"
//             >
//               {skill}
//             </text>
//           );
//         })}

//         {/* Data polygon */}
//         <polygon
//           points={skills.map((skill, i) => {
//             const angle = i * angleSlice - Math.PI / 2;
//             const value = categories[skill];
//             const x = 100 + Math.cos(angle) * (value * 20);
//             const y = 100 + Math.sin(angle) * (value * 20);
//             return `${x},${y}`;
//           }).join(' ')}
//           fill="rgba(99, 102, 241, 0.3)"
//           stroke="rgba(99, 102, 241, 1)"
//           strokeWidth="2"
//         />
//       </svg>
//     </div>
//   );
// };

// const ProgressBar = ({ value, max = 5, color = 'indigo' }) => {
//   const percentage = (value / max) * 100;
//   return (
//     <div className="w-full bg-gray-200 rounded-full h-2.5">
//       <div
//         className={`bg-${color}-600 h-2.5 rounded-full`}
//         style={{ width: `${percentage}%` }}
//       ></div>
//     </div>
//   );
// };

// const AssessmentDashboard = () => {
//   const latestAssessment = interviewData[1];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">Candidate Interview Analytics</h1>
//           <p className="text-gray-600">Visual assessment of interview performance metrics</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           {/* Performance Overview */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
//             <div className="flex justify-between items-center mb-6">
//               {interviewData.map((assessment, index) => (
//                 <div key={index} className="flex flex-col items-center">
//                   <PerformanceRadialChart score={assessment.score} />
//                   <span className="text-xs text-gray-500 mt-2">Assessment {index + 1}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-between text-xs text-gray-500">
//               <span>First Assessment</span>
//               <span>Latest Assessment</span>
//             </div>
//           </div>

//           {/* Skill Radar */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Skill Radar</h2>
//             <SkillRadarChart categories={latestAssessment.categories} />
//           </div>

//           {/* Quick Stats */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Assessment Metrics</h2>
//             <div className="space-y-4">
//               <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm font-medium">Communication</span>
//                   <span className="text-sm">{latestAssessment.communication_skills}/5</span>
//                 </div>
//                 <ProgressBar value={latestAssessment.communication_skills} color="blue" />
//               </div>
//               <div>
//               <div className="flex justify-between mb-1">
//                 <span className="text-sm font-medium">Technical</span>
//                 <span className="text-sm">{latestAssessment.technical_knowledge}/5</span>
//               </div>
//               <ProgressBar value={latestAssessment.technical_knowledge} color="yellow" />
//             </div>
//               <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm font-medium">Soft Skills</span>
//                   <span className="text-sm">{latestAssessment.soft_skills}/5</span>
//                 </div>
//                 <ProgressBar value={latestAssessment.soft_skills} color="green" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Strengths & Weaknesses */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Strengths</h2>
//             {latestAssessment.strengths.length > 0 ? (
//               <div className="space-y-3">
//                 {latestAssessment.strengths.map((strength, index) => (
//                   <div key={index} className="flex items-start">
//                     <div className="flex-shrink-0 mt-1 mr-3">
//                       <Circle className="w-4 h-4 text-green-500" fill="currentColor" />
//                     </div>
//                     <div className="text-gray-700">{strength}</div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500">No significant strengths identified</p>
//             )}
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Areas for Improvement</h2>
//             <div className="space-y-3">
//               {latestAssessment.weaknesses.map((weakness, index) => (
//                 <div key={index} className="flex items-start">
//                   <div className="flex-shrink-0 mt-1 mr-3">
//                     <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
//                   </div>
//                   <div className="text-gray-700">{weakness}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Red Flags */}
//         {latestAssessment.red_flags && latestAssessment.red_flags.length > 0 && (
//           <div className="bg-red-50 rounded-xl shadow-md p-6 mb-6 border border-red-200">
//             <h2 className="text-xl font-semibold mb-4 text-red-800 flex items-center">
//               <AlertTriangle className="w-5 h-5 mr-2" />
//               Red Flags
//             </h2>
//             <div className="space-y-3">
//               {latestAssessment.red_flags.map((flag, index) => (
//                 <div key={index} className="flex items-start">
//                   <div className="flex-shrink-0 mt-1 mr-3">
//                     <AlertTriangle className="w-4 h-4 text-red-500" />
//                   </div>
//                   <div className="text-red-700">{flag}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Suggestions */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Development Suggestions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {latestAssessment.suggestions.map((suggestion, index) => (
//               <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
//                 <div className="flex items-center mb-2">
//                   <Zap className="w-5 h-5 text-yellow-500 mr-2" />
//                   <h3 className="font-medium">Suggestion {index + 1}</h3>
//                 </div>
//                 <p className="text-gray-600 text-sm">{suggestion}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Category Breakdown */}
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Detailed Skill Assessment</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Category</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {Object.entries(latestAssessment.categories).map(([category, rating]) => (
//                   <tr key={category}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rating}/5</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <ProgressBar value={rating} max={5} color={
//                         rating >= 4 ? 'green' : rating >= 3 ? 'yellow' : 'red'
//                       } />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssessmentDashboard;