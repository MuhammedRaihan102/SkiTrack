import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import GoalForm from './goal-form';

const GoalList = () => {
    const [goals, setGoals] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/goals', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            const data = await response.json();
            setGoals(data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/goals/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            setGoals(goals.filter(goal => goal._id !== id));
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Goals</h1>
                <Button onClick={() => setIsFormOpen(true)}>Add Goal</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {goals.map((goal) => (
                    <Card key={goal._id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{goal.title}</CardTitle>
                                <Badge>{goal.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {goal.description}
                            </p>
                            {goal.relatedSkill && (
                                <p className="text-sm">
                                    Related Skill: {goal.relatedSkill.name}
                                </p>
                            )}
                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(goal._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {isFormOpen && (
                <GoalForm
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        fetchGoals();
                    }}
                />
            )}
        </div>
    );
};

export default GoalList;