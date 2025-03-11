import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Star } from 'lucide-react';

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
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Total Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalSkills}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.skillsInProgress}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Mastered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.completedSkills}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Skills</h2>
        {skills.slice(0, 5).map((skill) => (
          <Card key={skill._id} className="hover:shadow-md transition-shadow">
            <CardContent className="py-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{skill.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {getProficiencyLabel(skill.proficiency)} ({proficiencyToPercentage[skill.proficiency]}%)
                  </span>
                </div>
                <Progress 
                  value={proficiencyToPercentage[skill.proficiency]} 
                  className="h-2"
                />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${
                        index < (proficiencyToPercentage[skill.proficiency] / 20)
                          ? 'fill-primary text-primary'
                          : 'fill-muted text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {skill.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Overview;