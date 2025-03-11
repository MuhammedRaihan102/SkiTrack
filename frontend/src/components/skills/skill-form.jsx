import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const SkillForm = ({ skill, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    description: skill?.description || '',
    proficiency: skill?.proficiency || 'BEGINNER'
  });

  const proficiencyLevels = {
    BEGINNER: 20,
    INTERMEDIATE: 40,
    ADVANCED: 60,
    PROFICIENT: 80,
    EXPERT: 100
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = skill
        ? `http://localhost:5000/api/skills/${skill._id}`
        : 'http://localhost:5000/api/skills';
      
      const response = await fetch(url, {
        method: skill ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success(`Skill ${skill ? 'updated' : 'added'} successfully`);
        onSuccess();
      } else {
        const data = await response.json();
        toast.error(data.message || `Failed to ${skill ? 'update' : 'add'} skill`);
      }
    } catch (error) {
      toast.error(`Error ${skill ? 'updating' : 'adding'} skill`);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Skill Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter skill name"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your skill level and experience"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Proficiency Level</label>
            <Select
              value={formData.proficiency}
              onValueChange={(value) => setFormData({ ...formData, proficiency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner (20%)</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate (40%)</SelectItem>
                <SelectItem value="ADVANCED">Advanced (60%)</SelectItem>
                <SelectItem value="PROFICIENT">Proficient (80%)</SelectItem>
                <SelectItem value="EXPERT">Expert (100%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {skill ? 'Update' : 'Add'} Skill
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SkillForm;