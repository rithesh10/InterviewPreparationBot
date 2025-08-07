import React from 'react';
import { TrendingUp, Book, Clock, AlertTriangle, Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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

const LineChart = ({ data, labels, height = 300 }) => {
  const maxValue = Math.max(...data);
  const chartHeight = 200;
  const chartWidth = 400;
  const padding = 40;
  
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
        
        <path 
          d={pathData}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
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
const PieChart = ({ data, labels, colors, height = 250 }) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  let cumulativePercent = 0;

  return (
    <div className="w-full h-full" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {data.map((value, index) => {
          const percent = (value / total) * 100;
          const startX = 50 + 40 * Math.cos(2 * Math.PI * cumulativePercent / 100 - Math.PI / 2);
          const startY = 50 + 40 * Math.sin(2 * Math.PI * cumulativePercent / 100 - Math.PI / 2);
          cumulativePercent += percent;
          const endX = 50 + 40 * Math.cos(2 * Math.PI * cumulativePercent / 100 - Math.PI / 2);
          const endY = 50 + 40 * Math.sin(2 * Math.PI * cumulativePercent / 100 - Math.PI / 2);
          const largeArcFlag = percent > 50 ? 1 : 0;

          const midAngle = 2 * Math.PI * (cumulativePercent - percent / 2) / 100;
          const textX = 50 + 47 * Math.cos(midAngle - Math.PI / 2); 
          const textY = 50 + 47 * Math.sin(midAngle - Math.PI / 2); 
          const textAnchor = Math.cos(midAngle - Math.PI / 2) > 0 ? "start" : "end";

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
              {percent >= 3 && ( 
                <text
                  x={textX}
                  y={textY}
                  fill={colors[index]}
                  fontSize="4" 
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  fontWeight="bold"
                  className="drop-shadow-sm"
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

const Performance = ({ interviewData }) => {
  const assessments = interviewData.interview_score || [];
  
  const recentAssessments = assessments.slice(-3).reverse();
  const scoreHistory = assessments.map(assessment => assessment.score);
  const dates = assessments.map((_, index) => `Test ${index + 1}`);
  const currentScore = scoreHistory.length > 0 ? scoreHistory[scoreHistory.length - 1] : 0;
  
  const scoreDifference = scoreHistory.length > 1 
    ? currentScore - scoreHistory[scoreHistory.length - 2] 
    : 0;
  
  const nextGoal = Math.min(currentScore + 5, 100);
  
  let totalStrengths = 0;
  let totalWeaknesses = 0;
  let totalRedFlags = 0;
  
  const recentStrengths = [];
  const recentWeaknesses = [];
  const recentRedFlags = [];
  
  recentAssessments.forEach(assessment => {
    totalStrengths += assessment.strengths?.length || 0;
    totalWeaknesses += assessment.weaknesses?.length || 0;
    totalRedFlags += assessment.red_flags?.length || 0;
    
    if (assessment.strengths) recentStrengths.push(...assessment.strengths);
    if (assessment.weaknesses) recentWeaknesses.push(...assessment.weaknesses);
    if (assessment.red_flags) recentRedFlags.push(...assessment.red_flags);
  });

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
          {assessments.length > 3 && (
            <p className="text-sm text-gray-500 mt-1">
              Showing data from your 3 most recent assessments (of {assessments.length} total)
            </p>
          )}
        </header>

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

        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Recent Strengths" icon={<Award size={20} />} accentColor="green">
            <ul className="mt-3">
              {recentStrengths.map((strength, index) => (
                <ListItem key={index} type="strength">{strength}</ListItem>
              ))}
              {recentStrengths.length === 0 && (
                <p className="text-gray-500">No strengths identified in recent assessments</p>
              )}
            </ul>
          </Card>

          <Card title="Recent Weaknesses" icon={<AlertTriangle size={20} />} accentColor="amber">
            <ul className="mt-3">
              {recentWeaknesses.map((weakness, index) => (
                <ListItem key={index} type="weakness">{weakness}</ListItem>
              ))}
              {recentWeaknesses.length === 0 && (
                <p className="text-gray-500">No weaknesses identified in recent assessments</p>
              )}
            </ul>
          </Card>

          <Card title="Recent Red Flags" icon={<AlertTriangle size={20} />} accentColor="red">
            <ul className="mt-3">
              {recentRedFlags.map((flag, index) => (
                <ListItem key={index} type="redFlag">{flag}</ListItem>
              ))}
              {recentRedFlags.length === 0 && (
                <p className="text-gray-500">No red flags identified in recent assessments</p>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Performance;