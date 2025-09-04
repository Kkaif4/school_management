import { Home, Users, UserCog, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Home', url: '/dashboard', icon: Home, roles: ['admin', 'user'] },
  {
    title: 'Students',
    url: '/dashboard/students',
    icon: Users,
    roles: ['admin', 'user'],
  },
  {
    title: 'Teachers',
    url: '/dashboard/teachers',
    icon: UserCog,
    roles: ['ADMIN'],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isCollapsed = state === 'collapsed';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Crisp active/inactive styles
  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white font-medium shadow-md'
        : 'text-gray-200 hover:bg-indigo-500 hover:text-white'
    }`;

  return (
    <Sidebar
      className={`${isCollapsed ? 'w-14' : 'w-60'} 
        bg-gradient-to-b from-purple-700 via-indigo-700 to-purple-900 
        border-r border-purple-600 text-white`}>
      {/* Collapse Button */}
      <SidebarTrigger className="m-2 self-end text-gray-200 hover:bg-indigo-500/50 rounded-lg p-1" />

      <SidebarContent className="p-4">
        {!isCollapsed && (
          <div className="mb-6 p-3 rounded-lg bg-indigo-600/80 text-white">
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-gray-200 text-sm">
              {user?.role === 'admin' ? 'Principal' : 'teacher'}
            </p>
            {user?.schoolName && (
              <p className="text-gray-300 text-xs mt-1">{user.schoolName}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-gray-300 text-sm font-semibold mb-2">
              School
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems
                .filter((item) => item.roles.includes(user?.role || 'user'))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName}>
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="mt-auto pt-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full text-gray-200 hover:bg-red-600 hover:text-white ${
              isCollapsed ? 'px-2' : 'justify-start'
            }`}>
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
