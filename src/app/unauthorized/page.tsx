'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-provider';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleReturnToLogin = async () => {
    try {
      // Sign out any existing user to clear stuck state
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Fallback redirect even if signOut fails
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-red-500">
            <AlertCircle className="h-full w-full" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            You don't have permission to access the admin dashboard.
          </p>
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact your system administrator.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full" onClick={handleReturnToLogin}>
              <Link href="/login">
                Return to Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
