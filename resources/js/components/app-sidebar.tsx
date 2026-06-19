import { Link, usePage } from '@inertiajs/react';
import { Briefcase, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import kriteria from '@/routes/admin/kriteria';
import lowongan from '@/routes/hrd/lowongan';
import type { Auth, NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FolderGit2,
    // },
];

function getNavItemsByRole(role: string): NavItem[] {
    const dashboardItem: NavItem = {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    };

    if (role === 'admin') {
        return [
            dashboardItem,
            {
                title: 'Kelola Kriteria',
                href: kriteria.index(),
                icon: SlidersHorizontal,
            },
        ];
    }

    if (role === 'hrd') {
        return [
            dashboardItem,
            {
                title: 'Lowongan',
                href: lowongan.index(),
                icon: Briefcase,
            },
        ];
    }

    // pelamar — sementara hanya dashboard, menambah saat fitur pelamar dibuat
    return [dashboardItem];
}

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const mainNavItems = getNavItemsByRole(auth.user.role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
