import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CircleCheck } from 'lucide-react';

function Dashboard() {
	const navigate = useNavigate();
	
	const skillsData = [
	  { category: 'Languages', completed: 0, total: 12 },
	  { category: 'Frontend', completed: 0, total: 6 },
	  { category: 'Backend', completed: 0, total: 6 },
	  { category: 'Machine Learning', completed: 0, total: 16 },
	  { category: 'Aptitude', completed: 0, total: 34 }
	];
  
	const progressCategories = [
	  'Languages',
	  'Frontend',
	  'Backend',
	  'Machine Learning',
	  'Aptitude'
	];
  
	const handleCategoryClick = (category) => {
	  if (category === 'Languages') {
		navigate('/user/languages');
	  }
	};
  
	return (
	  <div>
		<main className="container mx-auto px-4 py-6">
		  <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Dashboard</h2>
		  
		  <div className="flex flex-col md:flex-row gap-6">
			<div className="bg-white rounded-lg shadow-md p-6 md:w-1/3">
			  <div className="flex mb-4">
				<div className="bg-gray-200 rounded-md py-2 px-4 w-1/2 text-center font-semibold text-gray-700">
				  Topics
				</div>
				<div className="bg-gray-200 rounded-md py-2 px-4 w-1/2 text-center font-semibold text-gray-700">
				  Badges
				</div>
			  </div>
			  
			  <div className="space-y-6">
				{skillsData.map((skill, index) => (
				  <div 
					key={index} 
					className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"
					onClick={() => handleCategoryClick(skill.category)}
				  >
					<span className="font-medium text-gray-800">{skill.category}</span>
					<div className="flex items-center">
					  <span className="mr-2 text-gray-700">{skill.completed} of {skill.total}</span>
					  <CircleCheck className="text-green-600" size={20} />
					</div>
				  </div>
				))}
			  </div>
			</div>
			
			<div className="bg-white rounded-lg shadow-md p-6 md:w-2/3">
			  <div className="bg-gray-200 rounded-md py-2 px-4 mb-6 text-center font-semibold text-gray-700">
				Progress
			  </div>
			  
			  <div className="flex flex-wrap justify-around mt-8 gap-6">
				{progressCategories.map((category, index) => (
				  <div 
					key={index} 
					className="flex flex-col items-center cursor-pointer"
					onClick={() => handleCategoryClick(category)}
				  >
					<div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center hover:bg-blue-100">
					  {index === 0 && <span className="text-blue-500 text-lg">0%</span>}
					</div>
					<span className="text-center text-gray-800">{category}</span>
				  </div>
				))}
			  </div>
			</div>
		  </div>
		</main>
	  </div>
	);
  }
  export default Dashboard;