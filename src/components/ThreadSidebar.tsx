import React, { useState } from 'react';
import { BellOff, Plus, Search, Users, X } from 'lucide-react';
import { Message, PresenceStatus, Thread, ThreadFilter, User } from '../types/chat';
import { Avatar, GroupStackedAvatars } from './Avatar';

interface ThreadSidebarProps {
  threads: Thread[];
  messagesByThread: Record<string, Message[]>;
  users: Record<string, User>;
  currentUser: User;
  activeThreadId: string;
  filter: ThreadFilter;
  searchQuery: string;
  onSelectThread: (threadId: string) => void;
  onChangeFilter: (filter: ThreadFilter) => void;
  onChangeSearch: (q: string) => void;
  onUpdateStatus: (status: PresenceStatus) => void;
  onOpenNewThread: () => void;
  onOpenJoinGroup: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

const FILTERS: { key: ThreadFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'groups', label: 'Groups' },
  { key: 'direct', label: 'Direct' },
];

const STATUS_OPTIONS: { value: PresenceStatus; label: string; dotColor: string }[] = [
  { value: 'online', label: 'Active', dotColor: '#00D68F' },
  { value: 'idle', label: 'Idle', dotColor: '#167D8D' },
  { value: 'dnd', label: 'Do not disturb', dotColor: '#FF5C5C' },
];

export const ThreadSidebar: React.FC<ThreadSidebarProps> = ({
  threads,
  messagesByThread,
  users,
  currentUser,
  activeThreadId,
  filter,
  searchQuery,
  onSelectThread,
  onChangeFilter,
  onChangeSearch,
  onUpdateStatus,
  onOpenNewThread,
  onOpenJoinGroup,
  searchInputRef,
}) => {
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const filteredThreads = threads.filter((thread) => {
    if (filter === 'unread' && thread.unreadCount === 0) return false;
    if (filter === 'groups' && thread.type !== 'group') return false;
    if (filter === 'direct' && thread.type !== 'direct') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const threadMsgs = messagesByThread[thread.id] ?? [];
      const lastMsg = threadMsgs[threadMsgs.length - 1];
      const matchesTitle = thread.title.toLowerCase().includes(q);
      const matchesSnippet = lastMsg?.text.toLowerCase().includes(q) ?? false;
      return matchesTitle || matchesSnippet;
    }
    return true;
  });

  const totalUnread = threads.reduce((acc, t) => acc + t.unreadCount, 0);

  return (
    <aside
      aria-label="Conversations"
      className="flex flex-col h-full w-full sm:w-[320px] lg:w-[300px] shrink-0 bg-[#071B2B] border-r border-[#B9E4E8]/[0.12]"
    >
      {/* Top Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setStatusMenuOpen((v) => !v)}
              className="flex items-center justify-center rounded-[28%] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B9E4E8] transition-transform active:scale-95"
              title="Change availability status"
              aria-expanded={statusMenuOpen}
              aria-label={`Your profile (${currentUser.name}), status ${currentUser.status}`}
            >
              <Avatar user={currentUser} size="md" knockoutColor="#071B2B" />
            </button>

            {statusMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setStatusMenuOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute left-0 top-12 z-40 w-52 rounded-xl nocturne-glass border border-[#B9E4E8]/15 p-1.5 nocturne-halo"
                >
                  <div className="px-2.5 py-1.5 border-b border-[#EEEEEE]/[0.06] mb-1">
                    <p className="text-[13px] font-semibold text-[#EEEEEE] truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] tabular-mono text-[#EEEEEE]/50 truncate">
                      {currentUser.handle}
                    </p>
                  </div>
                  {STATUS_OPTIONS.map((opt) => {
                    const selected = currentUser.status === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={selected}
                        onClick={() => {
                          onUpdateStatus(opt.value);
                          setStatusMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 min-h-[38px] rounded-lg text-[13px] transition-colors ${
                          selected
                            ? 'bg-[#167D8D]/25 text-[#EEEEEE] font-medium'
                            : 'text-[#EEEEEE]/75 hover:bg-[#0B2438]'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: opt.dotColor }}
                          />
                          <span>{opt.label}</span>
                        </span>
                        {selected && (
                          <span className="text-[10.5px] tabular-mono text-[#B9E4E8]">
                            On
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-[20px] font-semibold leading-[26px] tracking-[-0.01em] text-[#EEEEEE] truncate">
              Nocturne Chat
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onOpenJoinGroup}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#B9E4E8] hover:bg-[#167D8D]/20 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-[#B9E4E8]"
            aria-label="Join group"
            title="Join group"
          >
            <Users className="w-[18px] h-[18px]" />
          </button>
          <button
            type="button"
            onClick={onOpenNewThread}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#B9E4E8] hover:bg-[#167D8D]/20 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-[#B9E4E8]"
            aria-label="New conversation"
            title="New conversation"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recessed Search Input */}
      <div className="px-4 pb-3">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#EEEEEE]/40 absolute left-3.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Search channels or people..."
            aria-label="Search channels or people"
            className="w-full h-10 pl-10 pr-9 rounded-full bg-[#0B2438] border border-[#EEEEEE]/[0.08] text-[13.5px] text-[#EEEEEE] placeholder:text-[#EEEEEE]/40 focus:outline-none focus:border-[#167D8D]/60 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onChangeSearch('')}
              aria-label="Clear search"
              className="absolute right-2 w-7 h-7 rounded-full flex items-center justify-center text-[#EEEEEE]/50 hover:text-[#EEEEEE] hover:bg-[#10314A]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div
        className="px-4 pb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar"
        role="tablist"
        aria-label="Filter threads"
      >
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChangeFilter(f.key)}
              className={`h-8 px-3 rounded-full text-[12px] tabular-mono whitespace-nowrap shrink-0 transition-all duration-150 flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#B9E4E8] ${
                isActive
                  ? 'bg-[#167D8D] text-[#EEEEEE] font-semibold border border-transparent'
                  : 'bg-[#0B2438] text-[#EEEEEE]/70 font-medium border border-[#EEEEEE]/10 hover:text-[#EEEEEE] hover:border-[#B9E4E8]/25'
              }`}
            >
              <span>{f.label}</span>
              {f.key === 'unread' && totalUnread > 0 && (
                <span
                  className={`text-[10.5px] px-1.5 rounded-full leading-4 font-bold ${
                    isActive
                      ? 'bg-[#B9E4E8] text-[#071B2B]'
                      : 'bg-[#10314A] text-[#B9E4E8]'
                  }`}
                >
                  {totalUnread}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subtle Divider */}
      <div className="border-t border-[#EEEEEE]/[0.06]" />

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {filteredThreads.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-[14px] text-[#EEEEEE]/70 font-medium">
              No matching channels
            </p>
            <p className="text-[12.5px] text-[#EEEEEE]/45 mt-1">
              Try clearing your filter or starting a new thread.
            </p>
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const isSelected = thread.id === activeThreadId;
            const threadMsgs = messagesByThread[thread.id] ?? [];
            const lastMsg = threadMsgs[threadMsgs.length - 1];
            const otherMembers = thread.memberIds
              .filter((id) => id !== currentUser.id)
              .map((id) => users[id])
              .filter(Boolean);

            const knockout = isSelected ? '#0B2438' : '#071B2B';
            const lastSender = lastMsg ? users[lastMsg.senderId] : null;
            const snippetPrefix =
              thread.type === 'group' && lastSender
                ? lastSender.id === currentUser.id
                  ? 'You: '
                  : `${lastSender.name.split(' ')[0]}: `
                : lastSender?.id === currentUser.id
                ? 'You: '
                : '';

            const snippetText = lastMsg
              ? lastMsg.text || (lastMsg.attachment ? `Sent ${lastMsg.attachment.name}` : '')
              : thread.topic;

            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => onSelectThread(thread.id)}
                className={`w-full h-[72px] px-3 rounded-xl flex items-center gap-3 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#B9E4E8] ${
                  isSelected
                    ? 'bg-[#0B2438] border border-[#EEEEEE]/[0.08]'
                    : 'bg-transparent border border-transparent hover:bg-[#0B2438]/60'
                }`}
              >
                {thread.type === 'group' ? (
                  <GroupStackedAvatars users={otherMembers} knockoutColor={knockout} />
                ) : (
                  <Avatar
                    user={otherMembers[0] ?? currentUser}
                    size="md"
                    knockoutColor={knockout}
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[15.5px] font-semibold leading-[22px] tracking-[-0.005em] text-[#EEEEEE] truncate">
                        {thread.title}
                      </span>
                      {thread.notificationLevel === 'muted' && (
                        <BellOff
                          className="w-3.5 h-3.5 text-[#EEEEEE]/35 shrink-0"
                          aria-label="Muted"
                        />
                      )}
                    </div>
                    <span className="text-[10.5px] tabular-mono text-[#EEEEEE]/50 shrink-0">
                      {lastMsg?.timestamp ?? thread.lastActivity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                      className={`text-[12.5px] leading-[17px] truncate ${
                        thread.unreadCount > 0
                          ? 'text-[#EEEEEE]/95 font-medium'
                          : 'text-[#EEEEEE]/65 font-normal'
                      }`}
                    >
                      {snippetPrefix}
                      {snippetText}
                    </p>
                    {thread.unreadCount > 0 && (
                      <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#B9E4E8] text-[#071B2B] text-[10.5px] font-bold tabular-mono flex items-center justify-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Bottom Join Group Action */}
      <div className="px-3 py-3 border-t border-[#EEEEEE]/[0.06] shrink-0">
        <button
          type="button"
          onClick={onOpenJoinGroup}
          className="w-full h-11 px-4 rounded-xl bg-[#0B2438] hover:bg-[#10314A] border border-[#167D8D]/30 hover:border-[#167D8D]/65 text-[13.5px] font-semibold text-[#B9E4E8] flex items-center justify-center gap-2 transition-colors active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#B9E4E8]"
        >
          <Users className="w-4 h-4 text-[#167D8D]" />
          <span>Join Group</span>
        </button>
      </div>
    </aside>
  );
};
