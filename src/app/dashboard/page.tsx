import { verifySession } from '@/app/lib/dal';
import { redirect } from 'next/navigation';
import UserDashboard from '../ui/user-dashboard';
import AdminDashboard from '../ui/admin-dashboard';

export default async function Dashboard() {
  const session = await verifySession();
  const userRole = session?.user?.role; // Assuming 'role' is part of the session object

  /*if (userRole === 'admin') {
    return <AdminDashboard />;
  } else if (userRole === 'user') {
    return <UserDashboard />;
  } else {
    redirect('/login');
  }*/
  return <h1>Dashboard :D</h1>;
}
