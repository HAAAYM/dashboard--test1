
import { getFirebase } from '@/lib/firebase/client-config';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
export interface AdminSession {
  id: string;
  adminUid: string;
  adminName: string;
  loginAt: Date;
  logoutAt?: Date;
  durationSeconds?: number;
  status: 'active' | 'ended';
  source: 'dashboard_web';
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionResult {
  success: boolean;
  sessionId?: string;
  error?: string;
}

/**
 * Create a new admin session
 */
export async function createAdminSession(adminUid: string, adminName: string): Promise<SessionResult> {
  try {
    const { db } = getFirebase();
    if (!db) {
      return { success: false, error: 'Firestore not available' };
    }

    const sessionId = `session_${adminUid}_${Date.now()}`;
    const sessionRef = doc(db, 'admin_sessions', sessionId);
    
    const sessionData = {
      adminUid,
      adminName,
      loginAt: serverTimestamp(),
      status: 'active',
      source: 'dashboard_web',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(sessionRef, sessionData);
    
    return { success: true, sessionId };
  } catch (error) {
    console.error('Failed to create admin session:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create admin session' 
    };
  }
}

/**
 * End an active admin session
 */
export async function endAdminSession(sessionId: string): Promise<SessionResult> {
  try {
    const { db } = getFirebase();
    if (!db) {
      return { success: false, error: 'Firestore not available' };
    }

    const sessionRef = doc(db, 'admin_sessions', sessionId);
    
    // Get current session to calculate duration
    const sessionSnap = await getDoc(sessionRef);
    if (!sessionSnap.exists()) {
      return { success: false, error: 'Session not found' };
    }

    const sessionData = sessionSnap.data();
    const loginAt = sessionData.loginAt;
    const logoutAt = serverTimestamp();
    
    // Calculate duration in seconds
    let durationSeconds = 0;
    if (loginAt && typeof loginAt.toDate === 'function') {
      const loginTime = loginAt.toDate();
      const logoutTime = new Date();
      durationSeconds = Math.floor((logoutTime.getTime() - loginTime.getTime()) / 1000);
    }

    await updateDoc(sessionRef, {
      logoutAt,
      durationSeconds,
      status: 'ended',
      updatedAt: serverTimestamp(),
    });
    
    return { success: true, sessionId };
  } catch (error) {
    console.error('Failed to end admin session:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to end admin session' 
    };
  }
}
