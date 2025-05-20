import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import AdminDashboard from '../ui/admin-dashboard';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  return <AdminDashboard />;
}
