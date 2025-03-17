import { useState, useEffect } from 'react';
import { Plus, Star, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import SkillForm from './skill-form';

const SkillList = () => {
  const [skills, setSkills] = useState([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const proficiencyToPercentage = {
    BEGINNER: 20,
    INTERMEDIATE: 40,
    ADVANCED: 60,
    PROFICIENT: 80,
    EXPERT: 100
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (response.ok) {
        setSkills(data);
      }
    } catch (error) {
      toast.error('Failed to fetch skills');
    }
  };

  const handleDelete = async (skillId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/skills/${skillId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      if (response.ok) {
        setSkills(skills.filter(skill => skill._id !== skillId));
        toast.success('Skill deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  };

  const getProficiencyLabel = (proficiency) => {
    return proficiency.charAt(0) + proficiency.slice(1).toLowerCase();
  };

  return (
    <div className="container mx-auto p-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
          My Skills
        </h1>
        <Button 
          onClick={() => setIsAddingSkill(true)}
          className="bg-gradient-to-r from-indigo-600 to-blue-900 hover:from-indigo-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <Card 
            key={skill._id} 
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-gradient-to-br from-slate-900 to-blue-900 text-white border-blue-800"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300">
                {skill.name}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingSkill(skill)}
                  className="hover:bg-blue-800/50"
                >
                  <Edit2 className="h-4 w-4 text-blue-300" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(skill._id)}
                  className="hover:bg-red-900/50"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-200">
                    {getProficiencyLabel(skill.proficiency)}
                  </span>
                  <span className="text-sm font-medium text-blue-300">
                    {proficiencyToPercentage[skill.proficiency]}%
                  </span>
                </div>
                <Progress 
                  value={proficiencyToPercentage[skill.proficiency]} 
                  className="h-2.5 bg-blue-950"
                  indicatorClassName="bg-gradient-to-r from-blue-400 to-indigo-400"
                />
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < (proficiencyToPercentage[skill.proficiency] / 20)
                        ? 'fill-blue-400 text-blue-400'
                        : 'fill-blue-900 text-blue-900'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-blue-200 line-clamp-2">
                {skill.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {(isAddingSkill || editingSkill) && (
        <SkillForm
          skill={editingSkill}
          onClose={() => {
            setIsAddingSkill(false);
            setEditingSkill(null);
          }}
          onSuccess={() => {
            fetchSkills();
            setIsAddingSkill(false);
            setEditingSkill(null);
          }}
        />
      )}
    </div>
  );
};

export default SkillList;