import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle, Smartphone, Award } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-900 text-white mb-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 lg:py-32 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Master Vocational Skills with <br className="hidden sm:block" />
            <span className="text-indigo-300">Augmented Reality</span>
          </h1>
          <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            SkillAR Bharat brings hands-on training to your smartphone. Learn plumbing, electrical work, carpentry, and more through interactive camera-based modules.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
            <Smartphone className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive AR Training</h3>
          <p className="text-gray-600">
            Use your phone's camera to identify tools, practice movements, and get real-time feedback on your technique.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Validation</h3>
          <p className="text-gray-600">
            Our AI-powered system validates your work instantly, ensuring you master each step before moving forward.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Certified Progress</h3>
          <p className="text-gray-600">
            Track your progress, earn badges, and build a portfolio of verified skills to show potential employers.
          </p>
        </div>
      </div>

      {/* Popular Skills Preview */}
      <div className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Skills</h2>
            <p className="text-gray-600 mt-2">Start your journey with these high-demand trades</p>
          </div>
          <Link to="/signup" className="text-indigo-600 font-medium hover:text-indigo-700 hidden sm:flex items-center">
            View all skills <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Basic Electrical Wiring', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80', level: 'Beginner' },
            { title: 'Pipe Fitting Basics', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80', level: 'Intermediate' },
            { title: 'Woodworking Joints', image: 'https://images.unsplash.com/photo-1622126838652-f86260840451?auto=format&fit=crop&q=80', level: 'Beginner' },
            { title: 'AC Maintenance', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80', level: 'Advanced' },
          ].map((skill, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/5]">
              <img src={skill.image} alt={skill.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-md mb-2 border border-white/10">
                  {skill.level}
                </span>
                <h3 className="text-white font-bold text-lg leading-tight">{skill.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
