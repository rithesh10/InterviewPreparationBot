import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CircleCheck, Book, Play, Video, PenSquare, MessageSquare, User } from 'lucide-react';
function ContentPage() {
	const location = useLocation();
	const pathParts = location.pathname.split('/');
	const language = pathParts[2];
	const topic = decodeURIComponent(pathParts[3]);
  
	return (
	  <div>
		<Header />
		<main className="container mx-auto px-4 py-6">
		  <div className="flex flex-col md:flex-row gap-6">
			<div className="bg-white rounded-lg shadow-md p-6 md:w-1/3">
			  <div className="text-center mb-6">
				<h2 className="text-xl font-bold text-gray-800 underline">{language}</h2>
			  </div>
			  
			  <h3 className="text-lg font-semibold text-gray-800 mb-4">{topic}</h3>
			  
			  <div className="space-y-4">
				<div className="flex items-center space-x-2 p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
				  <Book size={20} className="text-blue-600" />
				  <span className="text-gray-700">Read Content</span>
				</div>
				
				<div className="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100">
				  <Video size={20} className="text-purple-600" />
				  <span className="text-gray-700">Watch Video</span>
				</div>
				
				<div className="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100">
				  <PenSquare size={20} className="text-green-600" />
				  <span className="text-gray-700">Take Quiz</span>
				</div>
				
				<div className="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100">
				  <MessageSquare size={20} className="text-amber-600" />
				  <span className="text-gray-700">AI Assistant</span>
				</div>
				
				<div className="flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100">
				  <Play size={20} className="text-red-600" />
				  <span className="text-gray-700">Feedback</span>
				</div>
			  </div>
			</div>
			
			<div className="bg-white rounded-lg shadow-md p-6 md:w-2/3">
			  <h2 className="text-2xl font-bold text-gray-800 mb-6">{topic}</h2>
			  
			  <div className="prose max-w-none">
				<h3 className="text-xl font-semibold text-gray-800 mb-4">{topic} in {language} Programming</h3>
				
				<p className="text-gray-700 mb-4">
				  {language} programming language provides several built-in data types that help in organizing and manipulating data in a program. 
				  These data types determine the type of value that can be stored in a variable, the amount of memory allocated to store 
				  the value, and the operations that can be performed on that value. Understanding the different data types in {language} 
				  programming is crucial for any programmer, as it enables them to write efficient, effective, and maintainable code.
				</p>
				
				<h4 className="text-lg font-semibold text-gray-800 mb-2">Integer Data Types</h4>
				
				<p className="text-gray-700 mb-4">
				  The integer data type is used to store whole numbers, either positive, negative, or zero. Integer data types are 
				  categorized into two groups: signed and unsigned.
				</p>
				
				<h5 className="text-base font-semibold text-gray-800 mb-2">Signed Integer Types:</h5>
				<ul className="list-disc pl-5 mb-4">
				  <li className="mb-2">
					<code className="bg-gray-100 px-1 rounded">int</code>: The <code className="bg-gray-100 px-1 rounded">int</code> type is the most common and versatile integer data type. It occupies 4 bytes (32 bits) and can store 
					a range of values from -2147483648 to 2147483647.
				  </li>
				  <li className="mb-2">
					<code className="bg-gray-100 px-1 rounded">short int</code>: The <code className="bg-gray-100 px-1 rounded">short int</code> type occupies 2 bytes (16 bits) and can store a range of values from -32768 to 
					32767.
				  </li>
				  <li>
					<code className="bg-gray-100 px-1 rounded">long int</code>: The <code className="bg-gray-100 px-1 rounded">long int</code> type occupies 8 bytes (64 bits) and can store a range of values from 
					-9223372036854775808 to 9223372036854775807.
				  </li>
				</ul>
			  </div>
			</div>
		  </div>
		</main>
		<Footer />
	  </div>
	);
  }
  export default ContentPage;