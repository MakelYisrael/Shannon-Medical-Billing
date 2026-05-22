import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { imageService } from '../services/imageService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { User, Mail, Phone, Building, Save, X, AlertCircle, Camera, Upload } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, userProfile, loading, error, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [pendingImageData, setPendingImageData] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    bio: '',
  });

  // Populate form with user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        phone: userProfile.phone || '',
        company: userProfile.company || '',
        bio: userProfile.bio || '',
      });
    }
  }, [userProfile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setSaveError(null);
    setImageError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      let finalImageUrl: string | undefined = userProfile?.profileImageUrl;

      // If there's a pending image, use it
      if (pendingImageData && user) {
        finalImageUrl = pendingImageData;
      }

      // Save all profile data
      const updates = {
        ...userProfile,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        company: formData.company,
        bio: formData.bio,
      };

      // If image URL changed, update it
      if (finalImageUrl && finalImageUrl !== userProfile?.profileImageUrl) {
        updates.profileImageUrl = finalImageUrl;
        if (user) {
          await userService.updateProfileImage(user.uid, finalImageUrl);
        }
      }

      await updateUserProfile(updates);

      // Clear pending image data after successful save
      setPendingImageData(null);
      setPreviewImage(null);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setPendingImageData(null);
    setSaveError(null);
    setImageError(null);
    // Reset form to original data
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        phone: userProfile.phone || '',
        company: userProfile.company || '',
        bio: userProfile.bio || '',
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('Image upload started:', file?.name, 'Editing mode:', isEditing);

    if (!file || !user) {
      console.warn('No file or user, returning');
      return;
    }

    // Reset previous errors
    setImageError(null);
    setSaveError(null);

    // Validate file
    const validation = imageService.validateImageFile(file);
    if (!validation.valid) {
      console.warn('File validation failed:', validation.error);
      setImageError(validation.error || 'Invalid image file');
      return;
    }

    setIsUploadingImage(true);
    console.log('Set isUploadingImage to true, starting compression...');

    try {
      // Compress image
      console.log('Compressing image...');
      const compressedDataUrl = await imageService.compressImage(file);
      console.log('Image compressed successfully');

      setPreviewImage(compressedDataUrl);
      setPendingImageData(compressedDataUrl);
      console.log('Preview and pending image data set');

      // Show message that image is ready to save
      if (!isEditing) {
        console.log('Not in editing mode, auto-saving image');
        // If not in editing mode, automatically save image to Firestore
        await handleQuickSaveImage(compressedDataUrl);
      } else {
        console.log('In editing mode, clearing upload state');
        // In editing mode, just clear the uploading state
        setIsUploadingImage(false);
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setImageError(err instanceof Error ? err.message : 'Failed to process image');
      setIsUploadingImage(false);
    }
  };

  const handleQuickSaveImage = async (imageDataUrl: string) => {
    console.log('handleQuickSaveImage called');

    if (!user) {
      console.warn('No user, returning');
      return;
    }

    try {
      console.log('Saving compressed image to Firestore...');

      // Save compressed image data directly to Firestore
      await userService.updateProfileImage(user.uid, imageDataUrl);

      console.log('Updating user profile context...');
      await updateUserProfile({
        ...userProfile,
        profileImageUrl: imageDataUrl,
      });

      console.log('Setting success state');
      setSaveSuccess(true);
      setPendingImageData(null);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error in handleQuickSaveImage:', err);
      setImageError(err instanceof Error ? err.message : 'Failed to save image');
    } finally {
      console.log('Clearing upload state');
      setIsUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information</p>
        </div>

        {/* Error Alert */}
        {(error || saveError) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {saveError || error}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {saveSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Picture Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Profile Picture
            </CardTitle>
            <CardDescription>Upload or change your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {imageError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{imageError}</AlertDescription>
              </Alert>
            )}

            {pendingImageData && !isEditing && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Click Edit Profile to save your new image
                </AlertDescription>
              </Alert>
            )}

            {pendingImageData && isEditing && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  New image will be saved when you click "Save All Changes"
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-6">
              {/* Avatar Preview */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ring-4 ring-blue-200">
                {previewImage || userProfile?.profileImageUrl ? (
                  <img
                    src={previewImage || userProfile?.profileImageUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-2xl">
                    {(userProfile?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                  </span>
                )}
              </div>

              {/* Upload Section */}
              <div className="flex-1">
                <label htmlFor="profile-image" className="block">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                    <Upload className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      {isUploadingImage ? 'Processing...' : 'Click to upload image'}
                    </span>
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-600 mt-2">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your email address</CardDescription>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="text-gray-900 font-medium">{user?.email}</div>
              <p className="text-sm text-gray-600 mt-1">This cannot be changed</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              {isEditing ? 'Edit your profile details' : 'Your profile details'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <>
                <Alert className="border-blue-200 bg-blue-50 mb-4">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    You can edit your information and upload a new profile picture. All changes will be saved together.
                  </AlertDescription>
                </Alert>

                {/* First Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Building className="h-4 w-4 inline mr-1" />
                    Company
                  </label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your Company"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <div className="text-sm text-gray-600">
                    {pendingImageData && (
                      <p className="mb-2">✓ Profile picture ready to save</p>
                    )}
                    {(formData.firstName !== userProfile?.firstName ||
                      formData.lastName !== userProfile?.lastName ||
                      formData.phone !== userProfile?.phone ||
                      formData.company !== userProfile?.company ||
                      formData.bio !== userProfile?.bio) && (
                      <p>✓ Profile information changes ready to save</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 flex-1"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? 'Saving All Changes...' : 'Save All Changes'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Display Mode */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      First Name
                    </label>
                    <p className="text-lg text-gray-900">{userProfile?.firstName || '—'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Last Name
                    </label>
                    <p className="text-lg text-gray-900">{userProfile?.lastName || '—'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <p className="text-lg text-gray-900">{userProfile?.phone || '—'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Company
                  </label>
                  <p className="text-lg text-gray-900">{userProfile?.company || '—'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Bio
                  </label>
                  <p className="text-lg text-gray-900 whitespace-pre-wrap">
                    {userProfile?.bio || '—'}
                  </p>
                </div>

                {/* Account Created */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Account Created
                  </label>
                  <p className="text-sm text-gray-600">
                    {userProfile?.createdAt
                      ? new Date(userProfile.createdAt.toDate()).toLocaleDateString()
                      : '—'}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
