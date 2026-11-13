export type PresenceStatus = 'online' | 'idle' | 'dnd';

export interface User {
  id: string;
  name: string;
  handle: string;
  role: string;
  initials: string;
  status: PresenceStatus;
  accentTone: string;
  secondaryTone: string;
  avatarPattern: 'waves' | 'horizon' | 'orbit' | 'prism' | 'crescent' | 'grid';
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface MessageAttachment {
  id: string;
  type: 'file' | 'audio' | 'visual';
  name: string;
  size: string;
  duration?: string;
  waveform?: number[];
  visualPalette?: [string, string, string];
  visualCaption?: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  codeSnippet?: string;
  timestamp: string;
  dayGroup: string;
  status?: 'sent' | 'delivered' | 'read';
  replyToId?: string;
  reactions: Reaction[];
  attachment?: MessageAttachment;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  assigneeId?: string;
}

export type NotificationLevel = 'all' | 'mentions' | 'muted';

export type ThreadFilter = 'all' | 'unread' | 'groups' | 'direct';

export interface Thread {
  id: string;
  type: 'group' | 'direct';
  title: string;
  topic: string;
  memberIds: string[];
  unreadCount: number;
  pinned?: boolean;
  notificationLevel: NotificationLevel;
  lastActivity: string;
  checklist: ChecklistItem[];
}
