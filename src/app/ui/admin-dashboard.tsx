import LogoutButton from './logout-button';

export default function AdminDashboard() {
  return (
    <div className='min-h-[100vh] flex bg-[#0e1216]'>
      {/* Sidebar Navigation */}
      <nav className='w-64 min-h-full bg-[#1a1f25] border-r border-[#353d47] flex flex-col py-8 px-6'>
        <div className='mb-10 flex items-center gap-2'>
          <span className='text-2xl font-bold text-[#708093]'>Admin</span>
          <span className='badge bg-[#515d6c] text-white border-none'>
            Dashboard
          </span>
        </div>
        <ul className='flex flex-col gap-2 text-[#ecf7f8] font-medium'>
          <li>
            <a className='block py-2 px-4 rounded-lg hover:bg-[#353d47] transition-colors cursor-pointer'>
              Overview
            </a>
          </li>
          <li>
            <a className='block py-2 px-4 rounded-lg hover:bg-[#353d47] transition-colors cursor-pointer'>
              Users
            </a>
          </li>
          <li>
            <a className='block py-2 px-4 rounded-lg hover:bg-[#353d47] transition-colors cursor-pointer'>
              Reports
            </a>
          </li>
          <li>
            <a className='block py-2 px-4 rounded-lg hover:bg-[#353d47] transition-colors cursor-pointer'>
              System Settings
            </a>
          </li>
        </ul>
        <div className='mt-auto pt-10'>
          <LogoutButton />
        </div>
      </nav>
      {/* Main Content */}
      <main className='flex-1 p-10 flex flex-col gap-8 bg-[#1a1f25] rounded-r-xl'>
        <header className='flex items-center justify-between mb-4'>
          <h1 className='text-2xl font-bold text-[#708093]'>Admin Dashboard</h1>
          <span className='badge bg-[#515d6c] text-white border-none'>
            Admin
          </span>
        </header>
        <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-[#272e36] border border-[#708093] rounded-lg p-6 flex flex-col items-center shadow'>
            <span className='text-4xl font-bold text-[#708093]'>12</span>
            <span className='text-sm mt-2 text-[#606e7f]'>
              Pending Approvals
            </span>
          </div>
          <div className='bg-[#272e36] border border-[#606e7f] rounded-lg p-6 flex flex-col items-center shadow'>
            <span className='text-4xl font-bold text-[#606e7f]'>5</span>
            <span className='text-sm mt-2 text-[#708093]'>New Users</span>
          </div>
          <div className='bg-[#272e36] border border-[#515d6c] rounded-lg p-6 flex flex-col items-center shadow'>
            <span className='text-4xl font-bold text-[#515d6c]'>3</span>
            <span className='text-sm mt-2 text-[#708093]'>System Alerts</span>
          </div>
        </section>
        <section>
          <h2 className='text-lg font-semibold mb-2 text-[#708093]'>
            Quick Actions
          </h2>
          <div className='flex flex-col md:flex-row gap-4'>
            <button className='btn flex-1 bg-[#515d6c] text-white border-none hover:bg-[#434d59]'>
              Manage Users
            </button>
            <button className='btn flex-1 bg-[#606e7f] text-white border-none hover:bg-[#708093]'>
              Review Reports
            </button>
            <button className='btn flex-1 bg-[#272e36] text-[#ecf7f8] border-none hover:bg-[#353d47]'>
              System Settings
            </button>
          </div>
        </section>
        <footer className='text-center text-sm text-[#708093] mt-8'>
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
