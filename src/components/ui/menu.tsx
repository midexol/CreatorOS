import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isSeparator?: boolean;
  onClick?: () => void;
  isActive?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface UserProfileSidebarProps {
  user: UserProfile;
  navItems: NavItem[];
  logoutItem: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const sidebarVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export const UserProfileSidebar = React.forwardRef<HTMLDivElement, UserProfileSidebarProps>(
  ({ user, navItems, logoutItem, className }, ref) => {
    return (
      <motion.aside
        ref={ref}
        className={cn(
          'flex h-full w-full max-w-xs flex-col rounded-xl border border-border2 bg-panel/80 backdrop-blur-xl p-4 text-slate-100 shadow-sm',
          className
        )}
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        aria-label="User Profile Menu"
      >
        {/* User Info Header */}
        <motion.div variants={itemVariants} className="flex items-center space-x-3.5 p-2">
          <img
            src={user.avatarUrl}
            alt={`${user.name}'s avatar`}
            className="h-11 w-11 rounded-full object-cover border border-amber/30 shrink-0"
          />
          <div className="flex flex-col truncate">
            <span className="font-semibold text-sm text-slate-100">{user.name}</span>
            <span className="text-xs text-slate-400 truncate">{user.email}</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="my-3 border-t border-border2" />

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1" role="navigation">
          {navItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.isSeparator && <motion.div variants={itemVariants} className="h-4" />}
              <motion.a
                href={item.href}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                variants={itemVariants}
                className={cn(
                  'group flex items-center rounded-xl px-3 py-2.5 text-xs font-medium transition-all border-l-2',
                  item.isActive
                    ? 'text-slate-50 border-amber bg-white/[0.08] shadow-sm'
                    : 'text-slate-400 border-transparent hover:text-slate-100 hover:bg-white/[0.04]'
                )}
              >
                <span className="mr-3 h-4 w-4 shrink-0 flex items-center justify-center">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-amber" />
              </motion.a>
            </React.Fragment>
          ))}
        </nav>

        {/* Logout Button */}
        <motion.div variants={itemVariants} className="mt-4 pt-2 border-t border-border2">
          <button
            onClick={logoutItem.onClick}
            className="group flex w-full items-center rounded-xl px-3 py-2.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <span className="mr-3 h-4 w-4 shrink-0 flex items-center justify-center">{logoutItem.icon}</span>
            <span>{logoutItem.label}</span>
          </button>
        </motion.div>
      </motion.aside>
    );
  }
);

UserProfileSidebar.displayName = 'UserProfileSidebar';
