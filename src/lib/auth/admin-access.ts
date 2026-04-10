import { getFirebase } from '@/lib/firebase/client-config';
import { doc, getDoc } from 'firebase/firestore';

export interface AdminUser {
  id: string;
  authUid: string;
  displayName: string;
  roleTemplate: string;
  permissions: string[];
  scopeType: string;
  scopeIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminAccessResult {
  success: boolean;
  adminUser?: AdminUser;
  error?: string;
}

/**
 * Check if authenticated user has admin access
 */
export async function checkAdminAccess(authUid: string): Promise<AdminAccessResult> {
  console.log('=== ADMIN ACCESS DEBUG ===');
  console.log('checkAdminAccess called with authUid:', authUid);
  
  try {
    const { db } = getFirebase();
    if (!db) {
      console.log('ERROR: Firestore not available');
      return { success: false, error: 'Firestore not available' };
    }

    // Query admin_users collection by authUid
    console.log('=== ADMIN ACCESS DEBUG ===');
    console.log('checkAdminAccess called with authUid:', authUid);
    console.log('Reading Firestore path:', `admin_users/${authUid}`);
    
    const adminUserRef = doc(db, 'admin_users', authUid);
    
    const adminUserSnap = await getDoc(adminUserRef);
    console.log('Document exists:', adminUserSnap.exists());

    if (!adminUserSnap.exists()) {
      console.log('ERROR: Admin user document not found');
      return { success: false, error: 'Admin user not found' };
    }

    const data = adminUserSnap.data();
    console.log('Raw document data:', data);
    console.log('isActive value:', data.isActive);
    console.log('isActive type:', typeof data.isActive);

    const adminUser: AdminUser = {
      id: adminUserSnap.id,
      authUid: data.authUid || authUid,
      displayName: data.displayName || '',
      roleTemplate: data.roleTemplate || '',
      permissions: data.permissions || [],
      scopeType: data.scopeType || '',
      scopeIds: data.scopeIds || [],
      isActive: data.isActive === true,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };

    console.log('Processed adminUser:', adminUser);
    console.log('adminUser.isActive after processing:', adminUser.isActive);

    // Check if admin user is active
    if (!adminUser.isActive) {
      console.log('ERROR: Admin access denied - not active');
      return { success: false, error: 'Admin access is inactive' };
    }

    console.log('SUCCESS: Admin access granted');
    return { success: true, adminUser };
  } catch (error: any) {
    console.error('ERROR: Admin access check failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to check admin access' 
    };
  }
}
