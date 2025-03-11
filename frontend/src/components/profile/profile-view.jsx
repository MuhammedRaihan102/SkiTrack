import { useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Github, Linkedin, Globe, Mail, Edit } from 'lucide-react';
import ProfileEdit from './profile-edit';

const ProfileView = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || 'No bio added yet',
    socialLinks: {
      github: user?.socialLinks?.github || '',
      linkedin: user?.socialLinks?.linkedin || '',
      portfolio: user?.socialLinks?.portfolio || ''
    }
  });

  const handleUpdateSuccess = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="relative">
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
              <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <ProfileEdit 
              profile={profile} 
              onClose={() => setIsEditing(false)}
              onSuccess={handleUpdateSuccess}
            />
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Social Links</h3>
                <div className="flex flex-col space-y-2">
                  {profile.socialLinks.github && (
                    <a 
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile.socialLinks.linkedin && (
                    <a 
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {profile.socialLinks.portfolio && (
                    <a 
                      href={profile.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
                    >
                      <Globe className="h-5 w-5" />
                      <span>Portfolio</span>
                    </a>
                  )}
                  <a 
                    href={`mailto:${profile.email}`}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;