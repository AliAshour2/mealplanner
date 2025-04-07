import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

interface DatabaseProfile {
  id: string;
  userId: string;
  email: string;
  subscriptionActive: boolean;
  subscriptionTier: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Define a minimal interface for the Clerk user properties we use
interface ClerkUser {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  imageUrl?: string;
  emailAddresses?: Array<{ emailAddress: string }>;
  createdAt?: number | null;
}

interface ProfileTabProps {
  user: ClerkUser;
  dbProfile?: DatabaseProfile | null;
}

const ProfileTab = ({ user, dbProfile }: ProfileTabProps) => {
  if (!user) return <div>User not found</div>;

  // Extract user data from Clerk
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const fullName = user.fullName || `${firstName} ${lastName}`;
  const email = user.emailAddresses?.[0]?.emailAddress || '';
  const imageUrl = user.imageUrl || '';
  
  // Format date consistently using en-US locale
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            View your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
            <div className="relative mb-4 sm:mb-0">
              <Avatar className="w-24 h-24 border-4 border-green-500">
                <AvatarImage src={imageUrl} alt={fullName} />
                <AvatarFallback className="text-2xl">
                  {fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={lastName} 
                    readOnly 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  readOnly
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm text-gray-500">Member since {memberSince}</p>
                </div>
                <Badge className={`${dbProfile?.subscriptionActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {dbProfile?.subscriptionActive ? dbProfile.subscriptionTier || 'Premium' : 'Free Plan'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />
        </CardContent>
      </Card>

      {dbProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>
              Information about your account status and subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Account ID</p>
                  <p>{dbProfile.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Subscription Status</p>
                  <p>{dbProfile.subscriptionActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Plan</p>
                  <p>{dbProfile.subscriptionActive ? dbProfile.subscriptionTier || 'Premium' : 'Free Plan'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p>{new Date(dbProfile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileTab;
