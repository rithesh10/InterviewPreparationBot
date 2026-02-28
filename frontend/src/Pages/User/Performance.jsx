import React from 'react';
import { TrendingUp, Book, Clock, AlertTriangle, Award, CheckCircle, XCircle, AlertCircle, CalendarDays, MessageSquare } from 'lucide-react';

const Card = ({ title, icon, children, accentColor = 'indigo' }) => {
  const colorClasses = {
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    blue: 'text-blue-600'
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

const StatCard = ({ title, value, subtitle, icon, trend, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'text-indigo-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
    blue: 'text-blue-500'
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

const LineChart = ({ data, labels, height = 260, strokeColor = '#4f46e5' }) => {
  if (!data.length) {
    return <p className="text-sm text-gray-500">No data yet</p>;
  }

  const safeMaxValue = Math.max(...data, 1);
  const chartHeight = 200;
  const chartWidth = 460;
  const padding = 40;
  const denominator = Math.max(data.length - 1, 1);

  const points = data.map((value, index) => {
    const x = padding + (index * (chartWidth - 2 * padding)) / denominator;
    const y = chartHeight - padding - ((value / safeMaxValue) * (chartHeight - 2 * padding));
    return { x, y };
  });

  const pathData = points.reduce((path, point, i) => {
    return path + (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`);
  }, '');

  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" style={{ height }}>
        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
          const y = chartHeight - padding - tick * (chartHeight - 2 * padding);
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" />
              <text x={padding - 6} y={y} fontSize="10" textAnchor="end" dominantBaseline="middle" fill="#6b7280">
                {Math.round(tick * safeMaxValue)}
              </text>
            </g>
          );
        })}

        {labels.map((label, i) => {
          const x = padding + (i * (chartWidth - 2 * padding)) / denominator;
          return (
            <g key={i} transform={`translate(${x},${chartHeight - padding + 5}) rotate(35)`}>
              <text x={0} y={0} fontSize="10" textAnchor="start" fill="#6b7280">{label}</text>
            </g>
          );
        })}

        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((point, i) => (
          <circle key={i} cx={point.x} cy={point.y} r="4" fill="white" stroke={strokeColor} strokeWidth="2">
            <title>{`${labels[i]}: ${data[i]}`}</title>
          </circle>
        ))}
      </svg>
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

const formatSessionDate = (value, index) => {
  if (!value) {
    return `Session ${index + 1}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `Session ${index + 1}`;
  }

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const estimateConfidenceScore = (text) => {
  if (!text) {
    return 50;
  }

  const normalized = String(text).toLowerCase();
  const positiveMarkers = ['clear', 'confident', 'articulate', 'structured', 'concise', 'well explained'];
  const negativeMarkers = ['hesitant', 'unclear', 'vague', 'rambling', 'nervous', 'weak'];

  let score = 50;
  positiveMarkers.forEach((marker) => {
    if (normalized.includes(marker)) score += 10;
  });
  negativeMarkers.forEach((marker) => {
    if (normalized.includes(marker)) score -= 10;
  });

  return Math.max(0, Math.min(100, score));
};

const weaknessTopicMap = {
  'Technical Depth': ['algorithm', 'system design', 'architecture', 'database', 'api', 'scalability', 'complexity'],
  Communication: ['communication', 'clarity', 'explain', 'articulate', 'vague', 'rambling'],
  'Problem Solving': ['approach', 'problem solving', 'logic', 'debug', 'break down'],
  Behavioral: ['behavioral', 'ownership', 'leadership', 'team', 'collaboration', 'conflict'],
  Confidence: ['confidence', 'hesitant', 'nervous', 'uncertain'],
  'Time Management': ['time', 'slow', 'pace', 'too long', 'incomplete']
};

const getWeaknessTopics = (weaknesses = []) => {
  const topicCounts = {};

  weaknesses.forEach((weakness) => {
    const text = String(weakness || '').toLowerCase();
    let matched = false;

    Object.entries(weaknessTopicMap).forEach(([topic, keywords]) => {
      if (keywords.some((keyword) => text.includes(keyword))) {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        matched = true;
      }
    });

    if (!matched) {
      topicCounts.Other = (topicCounts.Other || 0) + 1;
    }
  });

  return topicCounts;
};

const buildWeaknessHeatmap = (sessions) => {
  const topicsAggregate = {};
  const sessionTopicBreakdown = sessions.map((session) => {
    const topicCounts = getWeaknessTopics(session.weaknesses || []);
    Object.entries(topicCounts).forEach(([topic, count]) => {
      topicsAggregate[topic] = (topicsAggregate[topic] || 0) + count;
    });
    return topicCounts;
  });

  const topTopics = Object.entries(topicsAggregate)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([topic]) => topic);

  const matrix = sessions.map((session, sessionIndex) => {
    const perSession = sessionTopicBreakdown[sessionIndex] || {};
    return {
      label: formatSessionDate(session.created_at, sessionIndex),
      values: topTopics.map((topic) => perSession[topic] || 0)
    };
  });

  const maxValue = Math.max(
    1,
    ...matrix.flatMap((row) => row.values)
  );

  return { topics: topTopics, matrix, maxValue };
};

const intensityClass = (value, maxValue) => {
  if (value <= 0) return 'bg-gray-100 text-gray-400';
  const ratio = value / maxValue;
  if (ratio < 0.34) return 'bg-amber-100 text-amber-700';
  if (ratio < 0.67) return 'bg-amber-300 text-amber-900';
  return 'bg-amber-500 text-white';
};

const TimelineItem = ({ session, index }) => {
  const topicCounts = getWeaknessTopics(session.weaknesses || []);
  const dominantTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-gray-700 font-medium">
          <CalendarDays size={16} className="mr-2 text-indigo-500" />
          {formatSessionDate(session.created_at, index)}
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
          Session {index + 1}
        </span>
      </div>

      <div className="grid md:grid-cols-4 gap-2 text-sm">
        <div className="bg-gray-50 rounded p-2">
          <p className="text-gray-500">Score</p>
          <p className="font-semibold text-gray-900">{session.score ?? 0}/100</p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-gray-500">Confidence</p>
          <p className="font-semibold text-gray-900">{session.communication_confidence ?? 50}/100</p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-gray-500">Weaknesses</p>
          <p className="font-semibold text-gray-900">{(session.weaknesses || []).length}</p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-gray-500">Top Gap</p>
          <p className="font-semibold text-gray-900">{dominantTopic}</p>
        </div>
      </div>
    </div>
  );
};

const Performance = ({ interviewData }) => {
  const rawAssessments = interviewData.interview_score || [];
  const assessments = [...rawAssessments]
    .map((assessment) => ({
      ...assessment,
      communication_confidence:
        typeof assessment.communication_confidence === 'number'
          ? assessment.communication_confidence
          : estimateConfidenceScore(assessment.communication_skills)
    }))
    .sort((a, b) => {
      const left = new Date(a.created_at || 0).getTime();
      const right = new Date(b.created_at || 0).getTime();
      return left - right;
    });

  const recentAssessments = assessments.slice(-3).reverse();
  const scoreHistory = assessments.map((assessment) => assessment.score || 0);
  const confidenceHistory = assessments.map((assessment) => assessment.communication_confidence || 0);
  const sessionLabels = assessments.map((assessment, index) => formatSessionDate(assessment.created_at, index));
  const currentScore = scoreHistory.length ? scoreHistory[scoreHistory.length - 1] : 0;
  const scoreDifference = scoreHistory.length > 1 ? currentScore - scoreHistory[scoreHistory.length - 2] : 0;
  const nextGoal = Math.min(currentScore + 5, 100);

  const recentStrengths = [];
  const recentWeaknesses = [];
  const recentRedFlags = [];

  recentAssessments.forEach((assessment) => {
    if (assessment.strengths) recentStrengths.push(...assessment.strengths);
    if (assessment.weaknesses) recentWeaknesses.push(...assessment.weaknesses);
    if (assessment.red_flags) recentRedFlags.push(...assessment.red_flags);
  });

  const weaknessHeatmap = buildWeaknessHeatmap(assessments);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
          <p className="text-gray-600 mt-2">Interview analytics timeline with score, confidence, and weakness patterns</p>
        </header>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Current Score"
            value={currentScore}
            subtitle="/ 100"
            icon={<TrendingUp size={20} />}
            trend={`${scoreDifference >= 0 ? '+' : ''}${scoreDifference} vs previous`}
            color={scoreDifference >= 0 ? 'green' : 'orange'}
          />
          <StatCard
            title="Sessions"
            value={assessments.length}
            subtitle="completed"
            icon={<Book size={20} />}
            trend="Interview history tracked"
            color="indigo"
          />
          <StatCard
            title="Confidence"
            value={confidenceHistory.length ? confidenceHistory[confidenceHistory.length - 1] : 0}
            subtitle="/ 100"
            icon={<MessageSquare size={20} />}
            trend="Speaking confidence"
            color="blue"
          />
          <StatCard
            title="Next Goal"
            value={nextGoal}
            subtitle="target"
            icon={<Clock size={20} />}
            trend={`${nextGoal - currentScore} points to target`}
            color="orange"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card title="Score Progression" icon={<TrendingUp size={20} />}>
            <LineChart data={scoreHistory} labels={sessionLabels} strokeColor="#4f46e5" />
          </Card>
          <Card title="Confidence Progression" icon={<MessageSquare size={20} />} accentColor="blue">
            <LineChart data={confidenceHistory} labels={sessionLabels} strokeColor="#0284c7" />
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card title="Weak-Topic Heatmap" icon={<AlertTriangle size={20} />} accentColor="amber">
            {weaknessHeatmap.topics.length === 0 ? (
              <p className="text-sm text-gray-500">No weakness data to build heatmap yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-separate border-spacing-2">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-600">Session</th>
                      {weaknessHeatmap.topics.map((topic) => (
                        <th key={topic} className="text-left text-gray-600 whitespace-nowrap">{topic}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weaknessHeatmap.matrix.map((row) => (
                      <tr key={row.label}>
                        <td className="text-gray-700 font-medium whitespace-nowrap">{row.label}</td>
                        {row.values.map((value, idx) => (
                          <td key={`${row.label}-${idx}`} className="min-w-20">
                            <div className={`rounded px-2 py-1 text-center font-semibold ${intensityClass(value, weaknessHeatmap.maxValue)}`}>
                              {value}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title="Interview Timeline" icon={<CalendarDays size={20} />}>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {assessments.map((session, index) => (
                <TimelineItem key={session._id || index} session={session} index={index} />
              ))}
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Recent Strengths" icon={<Award size={20} />} accentColor="green">
            <ul className="mt-3">
              {recentStrengths.map((strength, index) => (
                <ListItem key={index} type="strength">{strength}</ListItem>
              ))}
              {recentStrengths.length === 0 && <p className="text-gray-500">No strengths identified yet</p>}
            </ul>
          </Card>

          <Card title="Recent Weaknesses" icon={<AlertTriangle size={20} />} accentColor="amber">
            <ul className="mt-3">
              {recentWeaknesses.map((weakness, index) => (
                <ListItem key={index} type="weakness">{weakness}</ListItem>
              ))}
              {recentWeaknesses.length === 0 && <p className="text-gray-500">No weaknesses identified yet</p>}
            </ul>
          </Card>

          <Card title="Recent Red Flags" icon={<AlertTriangle size={20} />} accentColor="red">
            <ul className="mt-3">
              {recentRedFlags.map((flag, index) => (
                <ListItem key={index} type="redFlag">{flag}</ListItem>
              ))}
              {recentRedFlags.length === 0 && <p className="text-gray-500">No red flags identified yet</p>}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Performance;
