import {MenuItemType} from '@/app/types/layout';

type UserDropdownItemType = {
    label?: string;
    icon?: string;
    url?: string;
    isDivider?: boolean;
    isHeader?: boolean;
    class?: string;
}

export const userDropdownItems: UserDropdownItemType[] = [
    {
        label: 'Welcome back!',
        isHeader: true
    },
    {
        label: 'Profile',
        icon: 'tablerUserCircle',
        url: '/pages/profile'
    },
    {
        isDivider: true
    },
    {
        label: 'Log Out',
        icon: 'tablerLogout2',
        url: 'sign-in',
        class: 'text-danger fw-semibold'
    }
];

export const menuItems: MenuItemType[] = [
    {
        label: 'Dashboard',
        icon: 'tablerLayoutDashboard',
        url: '/dashboard',
    },

    {label: 'Apps', isTitle: true},
    
    {
        label: 'Users',
        icon: 'tablerUsers',
        isCollapsed: true,
        children: [
            {label: 'User List', url: '/apps/users/users'},
        ]
    },
    
    {
        label: 'Case Info',
        icon: 'tablerBriefcase',
        isCollapsed: true,
        children: [
            {label: 'Case List', url: '/apps/caseinfo/case-list'},
        ]
    }
    
];


