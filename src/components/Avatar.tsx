import React from 'react';
import { PresenceStatus, User } from '../types/chat';

interface AvatarProps {
  user: User;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  knockoutColor?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-12 h-12 text-sm',
};

const STATUS_COLORS: Record<PresenceStatus, { bg: string; label: string }> = {
  online: { bg: '#00D68F', label: 'Active' },
  idle: { bg: '#167D8D', label: 'Idle' },
  dnd: { bg: '#FF5C5C', label: 'Do not disturb' },
};

function AvatarArt({ user }: { user: User }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`grad-${user.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={user.accentTone} stopOpacity="0.45" />
          <stop offset="100%" stopColor="#071B2B" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" fill="#0B2438" />
      <rect width="40" height="40" fill={`url(#grad-${user.id})`} />
      {user.avatarPattern === 'waves' && (
        <path
          d="M0 26 Q 10 20, 20 26 T 40 26 L 40 40 L 0 40 Z"
          fill={user.secondaryTone}
          fillOpacity="0.22"
        />
      )}
      {user.avatarPattern === 'crescent' && (
        <circle cx="29" cy="11" r="10" fill={user.secondaryTone} fillOpacity="0.22" />
      )}
      {user.avatarPattern === 'orbit' && (
        <circle
          cx="20"
          cy="20"
          r="13"
          fill="none"
          stroke={user.secondaryTone}
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />
      )}
      {user.avatarPattern === 'horizon' && (
        <line
          x1="0"
          y1="26"
          x2="40"
          y2="26"
          stroke={user.secondaryTone}
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
      )}
      {user.avatarPattern === 'prism' && (
        <polygon
          points="20,6 35,34 5,34"
          fill={user.secondaryTone}
          fillOpacity="0.16"
        />
      )}
      {user.avatarPattern === 'grid' && (
        <path
          d="M14 0 V40 M26 0 V40 M0 14 H40 M0 26 H40"
          stroke={user.secondaryTone}
          strokeOpacity="0.15"
          strokeWidth="1"
        />
      )}
    </svg>
  );
}

export const Avatar: React.FC<AvatarProps> = ({
  user,
  size = 'md',
  showStatus = true,
  knockoutColor = '#071B2B',
}) => {
  const statusInfo = STATUS_COLORS[user.status];

  return (
    <div className={`relative shrink-0 ${SIZE_MAP[size]}`}>
      <div className="relative w-full h-full squircle overflow-hidden flex items-center justify-center border border-[#B9E4E8]/15 select-none">
        <AvatarArt user={user} />
        <span className="relative z-10 font-semibold tracking-tight text-[#EEEEEE]">
          {user.initials}
        </span>
      </div>
      {showStatus && (
        <span
          title={`${user.name} · ${statusInfo.label}`}
          aria-label={statusInfo.label}
          className="absolute -bottom-0.5 -right-0.5 w-[10px] h-[10px] rounded-full"
          style={{
            backgroundColor: statusInfo.bg,
            boxShadow: `0 0 0 2px ${knockoutColor}`,
          }}
        />
      )}
    </div>
  );
};

interface GroupStackedAvatarsProps {
  users: User[];
  knockoutColor?: string;
}

export const GroupStackedAvatars: React.FC<GroupStackedAvatarsProps> = ({
  users,
  knockoutColor = '#071B2B',
}) => {
  const visible = users.slice(0, 3);
  return (
    <div className="flex items-center shrink-0 w-10 h-10 justify-center">
      <div className="flex items-center">
        {visible.map((u, idx) => (
          <div
            key={u.id}
            className={`relative w-6 h-6 squircle overflow-hidden flex items-center justify-center text-[9.5px] font-semibold text-[#EEEEEE] select-none ${
              idx > 0 ? '-ml-[10px]' : ''
            }`}
            style={{
              boxShadow: `0 0 0 2px ${knockoutColor}`,
              zIndex: visible.length - idx,
            }}
          >
            <AvatarArt user={u} />
            <span className="relative z-10">{u.initials}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
