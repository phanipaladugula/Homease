
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Shield, 
  Bell, 
  Eye, 
  Phone, 
  Mail, 
  User, 
  Lock, 
  Check, 
  AlertCircle,
  Settings as SettingsIcon
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [settings, setSettings] = useState({
    profileVisibility: true,
    showContact: false,
    emailNotifications: true,
    smsNotifications: false,
    matchNotifications: true,
    marketingEmails: false
  });

  useEffect(() => {
    const phoneVerified = localStorage.getItem('phoneVerified') === 'true';
    const emailVerified = localStorage.getItem('emailVerified') === 'true';
    setIsPhoneVerified(phoneVerified);
    setIsEmailVerified(emailVerified);
    
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  const handleVerifyPhone = () => {
    navigate('/phone-verification?return=/settings');
  };

  const handleVerifyEmail = () => {
    // Mock email verification
    localStorage.setItem('emailVerified', 'true');
    setIsEmailVerified(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-primary/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:bg-primary/10 text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Verification */}
          <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Shield className="h-5 w-5 text-primary" />
                Account Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-800">Phone Number</p>
                      <p className="text-sm text-gray-600">Required to view contact details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isPhoneVerified ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <>
                        <Badge variant="outline" className="text-amber-600 border-amber-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                        <Button 
                          onClick={handleVerifyPhone}
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          Verify
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-800">Email Address</p>
                      <p className="text-sm text-gray-600">For important notifications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEmailVerified ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <>
                        <Badge variant="outline" className="text-amber-600 border-amber-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                        <Button 
                          onClick={handleVerifyEmail}
                          size="sm"
                          variant="outline"
                          className="border-primary/20 text-primary hover:bg-primary/5"
                        >
                          Verify
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Eye className="h-5 w-5 text-primary" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visibility" className="text-base font-medium text-gray-800">
                      Profile Visibility
                    </Label>
                    <p className="text-sm text-gray-600">Allow others to find your profile</p>
                  </div>
                  <Switch
                    id="profile-visibility"
                    checked={settings.profileVisibility}
                    onCheckedChange={(checked) => handleSettingChange('profileVisibility', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-contact" className="text-base font-medium text-gray-800">
                      Show Contact Info
                    </Label>
                    <p className="text-sm text-gray-600">Display contact details to verified users</p>
                  </div>
                  <Switch
                    id="show-contact"
                    checked={settings.showContact}
                    onCheckedChange={(checked) => handleSettingChange('showContact', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Bell className="h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base font-medium text-gray-800">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600">Get notified via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications" className="text-base font-medium text-gray-800">
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-gray-600">Get notified via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="match-notifications" className="text-base font-medium text-gray-800">
                      Match Notifications
                    </Label>
                    <p className="text-sm text-gray-600">Get notified about new matches</p>
                  </div>
                  <Switch
                    id="match-notifications"
                    checked={settings.matchNotifications}
                    onCheckedChange={(checked) => handleSettingChange('matchNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails" className="text-base font-medium text-gray-800">
                      Marketing Emails
                    </Label>
                    <p className="text-sm text-gray-600">Receive promotional emails</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-white/95 backdrop-blur-sm border border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <User className="h-5 w-5 text-primary" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full border-primary/20 text-primary hover:bg-primary/5"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-primary/20 text-primary hover:bg-primary/5"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>

                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
