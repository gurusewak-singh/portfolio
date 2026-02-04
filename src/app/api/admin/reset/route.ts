import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

// DELETE - Remove all admin accounts to allow new setup
export async function DELETE(request: Request) {
  try {
    // Security: Check for reset key in headers
    const resetKey = request.headers.get('x-reset-key');
    
    // Simple security check - you can change this key
    if (resetKey !== 'RESET_ADMIN_2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Delete all admin accounts
    const result = await Admin.deleteMany({});
    
    return NextResponse.json({ 
      message: 'Admin accounts deleted successfully',
      deletedCount: result.deletedCount 
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error resetting admin:', err.message);
    return NextResponse.json({ error: `Failed to reset admin: ${err.message}` }, { status: 500 });
  }
}
