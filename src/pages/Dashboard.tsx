import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getSkills, getRecentUserSessions, enrollInSkill } from '../services/db';
import { Skill, TrainingSession } from '../types';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Play, Clock, Award, ChevronRight } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const Dashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [enrolledSkillDetails, setEnrolledSkillDetails] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch all available skills
        const allSkills = await getSkills();
        setSkills(allSkills);

        // Fetch recent sessions
        const userSessions = await getRecentUserSessions(user.uid);
        setSessions(userSessions);

        // Fetch details of enrolled skills
        if (userProfile?.enrolledSkills && userProfile.enrolledSkills.length > 0) {
          const enrolledDetails = allSkills.filter(skill => 
            userProfile.enrolledSkills.includes(skill.id)
          );
          setEnrolledSkillDetails(enrolledDetails);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userProfile]);

  const handleEnroll = async (skillId: string) => {
    if (!user) return;
    try {
      await enrollInSkill(user.uid, skillId);
      // Ideally update local state or re-fetch user profile context
      window.location.reload(); // Simple reload to refresh context for now
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  const isEnrolled = (skillId: string) => userProfile?.enrolledSkills?.includes(skillId);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userProfile?.displayName?.split(' ')[0] || 'Learner'}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              You have completed {sessions.length} training sessions. Keep up the great work!
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-6 py-3 bg-indigo-50 rounded-xl">
              <div className="text-2xl font-bold text-indigo-600">{enrolledSkillDetails.length}</div>
              <div className="text-xs text-indigo-700 font-medium uppercase tracking-wide">Enrolled</div>
            </div>
            <div className="text-center px-6 py-3 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {sessions.filter(s => s.completed).length}
              </div>
              <div className="text-xs text-green-700 font-medium uppercase tracking-wide">Completed</div>
            </div>
          </div>
        </div>

        {/* My Learning */}
        {enrolledSkillDetails.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">My Learning</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledSkillDetails.map(skill => (
                <Card key={skill.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="relative h-40 bg-gray-200">
                    <img src={skill.imageUrl} alt={skill.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-indigo-600">
                      {skill.difficulty}
                    </div>
                  </div>
                  <CardContent className="flex-grow pt-4">
                    <h3 className="font-bold text-lg mb-2">{skill.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{skill.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0 border-t-0 bg-transparent">
                    <Link to={`/training/${skill.id}`} className="w-full">
                      <Button className="w-full">
                        <Play className="w-4 h-4 mr-2" /> Continue Training
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Available Skills */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Explore Skills</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.filter(s => !isEnrolled(s.id)).map(skill => (
              <Card key={skill.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="relative h-40 bg-gray-200">
                  <img src={skill.imageUrl} alt={skill.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-700">
                    {skill.difficulty}
                  </div>
                </div>
                <CardContent className="flex-grow pt-4">
                  <h3 className="font-bold text-lg mb-2">{skill.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{skill.description}</p>
                </CardContent>
                <CardFooter className="pt-0 border-t-0 bg-transparent">
                  <Button 
                    variant="outline" 
                    className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    onClick={() => handleEnroll(skill.id)}
                  >
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {skills.length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No skills available yet. Check back later!</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity */}
        {sessions.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {sessions.map((session) => {
                  const skill = skills.find(s => s.id === session.skillId);
                  return (
                    <div key={session.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.accuracyScore > 80 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          <Award size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{skill?.title || 'Unknown Skill'}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(session.timestamp).toLocaleDateString()} • Score: {session.accuracyScore}%
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        {session.completed ? 'Completed' : 'In Progress'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};
