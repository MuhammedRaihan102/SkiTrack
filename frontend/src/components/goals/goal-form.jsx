import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { DatePicker } from '../ui/date-picker';

const GoalForm = ({ onClose, onSuccess }) => {
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetDate: new Date(),
        relatedSkill: '',
        status: 'Not Started'
    });

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
            setSkills(data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error creating goal:', error);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Goal Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <Textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <DatePicker
                        value={formData.targetDate}
                        onChange={(date) => setFormData({ ...formData, targetDate: date })}
                    />
                    <Select
                        value={formData.relatedSkill}
                        onValueChange={(value) => setFormData({ ...formData, relatedSkill: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Related Skill" />
                        </SelectTrigger>
                        <SelectContent>
                            {skills.map((skill) => (
                                <SelectItem key={skill._id} value={skill._id}>
                                    {skill.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Not Started">Not Started</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                        <Button type="submit">Add Goal</Button>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default GoalForm;