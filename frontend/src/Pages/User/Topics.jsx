import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CircleCheck, Book, Play, Video, PenSquare, MessageSquare, User } from 'lucide-react';

function TopicsList() {
	const navigate = useNavigate();
	const location = useLocation();
	const language = location.pathname.split('/')[2];
	
	const topics = [
	  'Data Types',
	  'Variables',
	  'Operators',
	  'Control Structures',
	  'Functions',
	  'Arrays'
	];
  
	const handleTopicClick = (topic) => {
	  const formattedTopic = topic.replace(/\s+/g, '%20');
	  navigate(`/content/${language}/${formattedTopic}/content`);
	};
  
	return (
	  <div>
		<main className="container mx-auto px-4 py-6">
		  <div className="flex flex-col md:flex-row gap-6">
			<div className="bg-white rounded-lg shadow-md p-6 md:w-2/5">
			  <div className="bg-gray-200 rounded-md py-2 px-4 mb-4 text-center font-semibold text-gray-700">
				Topics
			  </div>
			  
			  <div className="space-y-2 py-2">
				{topics.map((topic, index) => (
				  <div 
					key={index} 
					className="py-3 px-2 cursor-pointer hover:bg-gray-100 rounded"
					onClick={() => handleTopicClick(topic)}
				  >
					<span className="font-medium text-gray-800">{topic}</span>
				  </div>
				))}
			  </div>
			</div>
			
			<div className="bg-white rounded-lg shadow-md p-6 md:w-3/5">
			  <div className="bg-gray-200 rounded-md py-2 px-4 mb-6 text-center font-semibold text-gray-700">
				Short Notes
			  </div>
			  
			  <textarea 
				className="w-full h-64 p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="Type your notes here..."
			  />
			  
			  <div className="flex justify-center mt-4">
				<button className="bg-black text-white py-2 px-8 rounded-md hover:bg-gray-800">
				  Edit
				</button>
			  </div>
			</div>
		  </div>
		</main>
	  </div>
	);
  }
  
  export default TopicsList;