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
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Skills</h1>
        <Button onClick={() => setIsAddingSkill(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <Card key={skill._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">{skill.name}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingSkill(skill)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(skill._id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {getProficiencyLabel(skill.proficiency)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {proficiencyToPercentage[skill.proficiency]}%
                    </span>
                  </div>
                  <Progress 
                    value={proficiencyToPercentage[skill.proficiency]} 
                    className="h-2"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{skill.description}</p>
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
              </div>
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