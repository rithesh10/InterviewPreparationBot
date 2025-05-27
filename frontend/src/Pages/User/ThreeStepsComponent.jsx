import React from 'react';
import { Upload, Video, FileText } from 'lucide-react';

const ThreeStepsComponent = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg m-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              You're on the right path to discover where you stand
            </h2>
            <p className="text-lg text-gray-600">
              Our assessment process will help you understand your strengths and identify opportunities for growth in your career journey.
            </p>
          </div>
          
          <div className="space-y-4">
            <button className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 text-left rounded-lg border-l-4 border-blue-500 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Upload className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">1. Upload Resume</h3>
                <p className="text-gray-600">Submit your resume for comprehensive skills analysis</p>
              </div>
            </button>
            
            <button className="w-full flex items-center p-4 bg-purple-50 hover:bg-purple-100 text-left rounded-lg border-l-4 border-purple-500 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Video className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">2. Take Interview</h3>
                <p className="text-gray-600">Complete personalized assessment questions tailored to your profile</p>
              </div>
            </button>
            
            <button className="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 text-left rounded-lg border-l-4 border-green-500 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <FileText className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">3. Get Your Report Card</h3>
                <p className="text-gray-600">Receive detailed insights about your career readiness and next steps</p>
              </div>
            </button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-purple-100 aspect-square flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-inner flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
                <div className="h-4 w-3/4 mx-auto bg-white rounded-full mb-3"></div>
                <div className="h-4 w-1/2 mx-auto bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-300 rounded-full opacity-70"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>      
    </div>
  );
};

export default ThreeStepsComponent;