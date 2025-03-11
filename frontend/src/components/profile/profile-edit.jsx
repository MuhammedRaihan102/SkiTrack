import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ProfileEdit = ({ profile, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    socialLinks: {
      github: profile?.socialLinks?.github || '',
      linkedin: profile?.socialLinks?.linkedin || '',
      portfolio: profile?.socialLinks?.portfolio || ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedProfile = await response.json();
        toast.success('Profile updated successfully');
        onSuccess(updatedProfile);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Bio</label>
        <Textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself..."
          className="mt-1"
          rows={4}
        />
      </div>
      <div>
        <label className="text-sm font-medium">GitHub URL</label>
        <Input
          value={formData.socialLinks.github}
          onChange={(e) => setFormData({
            ...formData,
            socialLinks: { ...formData.socialLinks, github: e.target.value }
          })}
          placeholder="https://github.com/username"
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">LinkedIn URL</label>
        <Input
          value={formData.socialLinks.linkedin}
          onChange={(e) => setFormData({
            ...formData,
            socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
          })}
          placeholder="https://linkedin.com/in/username"
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Portfolio URL</label>
        <Input
          value={formData.socialLinks.portfolio}
          onChange={(e) => setFormData({
            ...formData,
            socialLinks: { ...formData.socialLinks, portfolio: e.target.value }
          })}
          placeholder="https://yourportfolio.com"
          className="mt-1"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileEdit;