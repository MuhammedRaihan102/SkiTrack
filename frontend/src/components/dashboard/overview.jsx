import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Star, TrendingUp, Clock, Trophy } from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState({
    totalSkills: 0,
    skillsInProgress: 0,
    completedSkills: 0
  });
  const [skills, setSkills] = useState([]);

  const proficiencyToPercentage = {
    BEGINNER: 20,
    INTERMEDIATE: 40,
    ADVANCED: 60,
    PROFICIENT: 80,
    EXPERT: 100
  };

  const getProficiencyLabel = (proficiency) => {
    return proficiency.charAt(0) + proficiency.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/skills', {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        const data = await response.json();
        setSkills(data);
        
        setStats({
          totalSkills: data.length,
          skillsInProgress: data.filter(skill => proficiencyToPercentage[skill.proficiency] < 100).length,
          completedSkills: data.filter(skill => proficiencyToPercentage[skill.proficiency] === 100).length
        });
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
        Dashboard
      </h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-slate-900 to-blue-900 border-blue-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-blue-300 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              Total Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-400">
              {stats.totalSkills}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-900 to-indigo-900 border-indigo-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-indigo-300 flex items-center gap-2">
              <Clock className="h-6 w-6 text-indigo-400" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-indigo-400">
              {stats.skillsInProgress}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-900 to-cyan-900 border-cyan-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-cyan-300 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-cyan-400" />
              Mastered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-cyan-400">
              {stats.completedSkills}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold gradient-text">Recent Skills</h2>
        <div className="grid gap-4">
          {skills.slice(0, 5).map((skill) => (
            <Card key={skill._id} className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{skill.name}</h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {getProficiencyLabel(skill.proficiency)}
                    </span>
                  </div>
                  <Progress 
                    value={proficiencyToPercentage[skill.proficiency]} 
                    className="h-2.5 bg-blue-100 dark:bg-blue-900"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${
                          index < (proficiencyToPercentage[skill.proficiency] / 20)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {skill.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;