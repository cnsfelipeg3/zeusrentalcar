import { LayoutDashboard, Car, CalendarRange, Users, LogOut, Settings, Radio, BarChart3 } from "lucide-react";
import zeusLogo from "@/assets/zeus-logo-hd.png";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Live", url: "/admin/live", icon: Radio },
  { title: "Reservas", url: "/admin/bookings", icon: CalendarRange },
  { title: "Frota", url: "/admin/fleet", icon: Car },
  { title: "Clientes", url: "/admin/customers", icon: Users },
  { title: "Relatório", url: "/admin/report", icon: BarChart3 },
  { title: "Configurações", url: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  onSignOut: () => void;
}

export function AdminSidebar({ onSignOut }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (url: string) =>
    url === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-6 flex justify-center h-auto">
            <img src={zeusLogo} alt="Zeus" className={`${collapsed ? "h-8 max-w-[40px]" : "h-14 max-w-[160px]"} w-auto object-contain brightness-125 contrast-125 drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]`} />
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={`transition-colors ${
                      isActive(item.url)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onSignOut}
              tooltip="Sair"
              className="text-destructive/80 hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
