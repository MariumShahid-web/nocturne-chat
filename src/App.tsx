import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  PanelRight,
  Search,
  X,
} from 'lucide-react';
import { Avatar, GroupStackedAvatars } from './components/Avatar';
import { ChannelInfoDrawer } from './components/ChannelInfoDrawer';
import { ComposerDock } from './components/ComposerDock';
import { JoinGroupModal } from './components/JoinGroupModal';
import { MessageBubble } from './components/MessageBubble';
import { NewThreadModal } from './components/NewThreadModal';
import { ThreadSidebar } from './components/ThreadSidebar';
import {
  CURRENT_USER_ID,
  DISCOVERABLE_GROUPS,
  INITIAL_MESSAGES,
  INITIAL_THREADS,
  USERS,
} from './data/initialData';
import {
  Message,
  MessageAttachment,
  NotificationLevel,
  PresenceStatus,
  Thread,
  ThreadFilter,
  User,
} from './types/chat';

const CONTEXTUAL_REPLIES = [
  'Got it — logging that into tonight’s run sheet.',
  'That timing works well for the east dock setup. Let’s lock it in.',
  'Sounds clean. I can double-check the levels once we wrap this pass.',
  'Just pulled the update on my end too — everything lines up.',
  'Perfect, keeping the ambient floor right where it is.',
];

function formatNowTime(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export default function App() {
  const [users, setUsers] = useState<Record<string, User>>(USERS);
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [messagesByThread, setMessagesByThread] = useState<Record<string, Message[]>>(
    INITIAL_MESSAGES
  );
  const [activeThreadId, setActiveThreadId] = useState<string>(INITIAL_THREADS[0].id);
  const [filter, setFilter] = useState<ThreadFilter>('all');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [threadSearchOpen, setThreadSearchOpen] = useState(false);
  const [threadSearchQuery, setThreadSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [newThreadModalOpen, setNewThreadModalOpen] = useState(false);
  const [joinGroupModalOpen, setJoinGroupModalOpen] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [typingUserByThread, setTypingUserByThread] = useState<Record<string, string | null>>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sidebarSearchRef = useRef<HTMLInputElement | null>(null);
  const replyTimeoutRef = useRef<number | null>(null);

  const currentUser = users[CURRENT_USER_ID];
  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId) ?? threads[0],
    [threads, activeThreadId]
  );

  const activeMessages = useMemo(
    () => messagesByThread[activeThread.id] ?? [],
    [messagesByThread, activeThread.id]
  );

  const visibleMessages = useMemo(() => {
    if (!threadSearchQuery.trim()) return activeMessages;
    const q = threadSearchQuery.toLowerCase();
    return activeMessages.filter(
      (m) =>
        m.text.toLowerCase().includes(q) ||
        (m.attachment?.name.toLowerCase().includes(q) ?? false) ||
        (m.codeSnippet?.toLowerCase().includes(q) ?? false)
    );
  }, [activeMessages, threadSearchQuery]);

  // Clear unread when switching into a thread
  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setMobileShowChat(true);
    setReplyingTo(null);
    setThreadSearchOpen(false);
    setThreadSearchQuery('');
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  };

  // Initial clear for default open thread on desktop
  useEffect(() => {
    setThreads((prev) =>
      prev.map((t, idx) => (idx === 0 ? { ...t, unreadCount: 0 } : t))
    );
  }, []);

  // Scroll to bottom when active messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThreadId, activeMessages.length]);

  // Global keyboard shortcuts (Cmd/Ctrl+K for search, Escape to dismiss)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sidebarSearchRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (joinGroupModalOpen) setJoinGroupModalOpen(false);
        else if (newThreadModalOpen) setNewThreadModalOpen(false);
        else if (threadSearchOpen) {
          setThreadSearchOpen(false);
          setThreadSearchQuery('');
        } else if (replyingTo) {
          setReplyingTo(null);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [joinGroupModalOpen, newThreadModalOpen, threadSearchOpen, replyingTo]);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) window.clearTimeout(replyTimeoutRef.current);
    };
  }, []);

  const handleUpdateStatus = (status: PresenceStatus) => {
    setUsers((prev) => ({
      ...prev,
      [CURRENT_USER_ID]: { ...prev[CURRENT_USER_ID], status },
    }));
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessagesByThread((prev) => {
      const list = prev[activeThread.id] ?? [];
      const updated = list.map((msg) => {
        if (msg.id !== messageId) return msg;
        const existing = msg.reactions.find((r) => r.emoji === emoji);
        let nextReactions = msg.reactions;
        if (existing) {
          const already = existing.userIds.includes(CURRENT_USER_ID);
          const nextUserIds = already
            ? existing.userIds.filter((id) => id !== CURRENT_USER_ID)
            : [...existing.userIds, CURRENT_USER_ID];
          nextReactions =
            nextUserIds.length === 0
              ? msg.reactions.filter((r) => r.emoji !== emoji)
              : msg.reactions.map((r) =>
                  r.emoji === emoji ? { ...r, userIds: nextUserIds } : r
                );
        } else {
          nextReactions = [
            ...msg.reactions,
            { emoji, userIds: [CURRENT_USER_ID] },
          ];
        }
        return { ...msg, reactions: nextReactions };
      });
      return { ...prev, [activeThread.id]: updated };
    });
  };

  const handleSendMessage = (text: string, attachment?: MessageAttachment) => {
    const threadId = activeThread.id;
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      threadId,
      senderId: CURRENT_USER_ID,
      text,
      timestamp: formatNowTime(),
      dayGroup: 'Today',
      status: 'delivered',
      replyToId: replyingTo?.id,
      reactions: [],
      attachment,
    };

    setMessagesByThread((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), newMessage],
    }));
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, lastActivity: newMessage.timestamp } : t
      )
    );
    setReplyingTo(null);

    // Simulate a natural collaborator typing & response in that thread
    const responderIds = activeThread.memberIds.filter(
      (id) => id !== CURRENT_USER_ID
    );
    if (responderIds.length > 0) {
      const responderId =
        responderIds[Math.floor(Math.random() * responderIds.length)];
      const responder = users[responderId];
      if (responder) {
        window.setTimeout(() => {
          setTypingUserByThread((prev) => ({
            ...prev,
            [threadId]: responder.name.split(' ')[0],
          }));
        }, 420);

        replyTimeoutRef.current = window.setTimeout(() => {
          const replyMsg: Message = {
            id: `m-${Date.now() + 1}`,
            threadId,
            senderId: responderId,
            text: CONTEXTUAL_REPLIES[
              Math.floor(Math.random() * CONTEXTUAL_REPLIES.length)
            ],
            timestamp: formatNowTime(),
            dayGroup: 'Today',
            reactions: [],
          };
          setTypingUserByThread((prev) => ({ ...prev, [threadId]: null }));
          setMessagesByThread((prev) => ({
            ...prev,
            [threadId]: [
              ...(prev[threadId] ?? []).map((m) =>
                m.id === newMessage.id ? { ...m, status: 'read' as const } : m
              ),
              replyMsg,
            ],
          }));
        }, 1650);
      }
    }
  };

  const handleToggleChecklistItem = (threadId: string, itemId: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id !== threadId
          ? t
          : {
              ...t,
              checklist: t.checklist.map((item) =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item
              ),
            }
      )
    );
  };

  const handleAddChecklistItem = (threadId: string, label: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id !== threadId
          ? t
          : {
              ...t,
              checklist: [
                ...t.checklist,
                {
                  id: `c-${Date.now()}`,
                  label,
                  completed: false,
                  assigneeId: CURRENT_USER_ID,
                },
              ],
            }
      )
    );
  };

  const handleChangeNotificationLevel = (
    threadId: string,
    level: NotificationLevel
  ) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, notificationLevel: level } : t
      )
    );
  };

  const handleCreateThread = (
    title: string,
    topic: string,
    memberIds: string[]
  ) => {
    // If DM and already exists, jump straight to it
    if (memberIds.length === 1) {
      const existingDm = threads.find(
        (t) =>
          t.type === 'direct' &&
          t.memberIds.includes(memberIds[0]) &&
          t.memberIds.includes(CURRENT_USER_ID)
      );
      if (existingDm) {
        handleSelectThread(existingDm.id);
        return;
      }
    }

    const newId = `t-${Date.now()}`;
    const newThread: Thread = {
      id: newId,
      type: memberIds.length > 1 ? 'group' : 'direct',
      title,
      topic,
      memberIds: [CURRENT_USER_ID, ...memberIds],
      unreadCount: 0,
      notificationLevel: 'all',
      lastActivity: formatNowTime(),
      checklist: [],
    };
    setThreads((prev) => [newThread, ...prev]);
    setMessagesByThread((prev) => ({ ...prev, [newId]: [] }));
    handleSelectThread(newId);
  };

  const handleJoinGroup = (groupName: string) => {
    const cleanName = groupName.trim();
    if (!cleanName) return;

    const existing = threads.find(
      (t) =>
        t.type === 'group' &&
        t.title.toLowerCase() === cleanName.toLowerCase()
    );

    if (existing) {
      if (filter === 'direct' || filter === 'unread') {
        setFilter('all');
      }
      handleSelectThread(existing.id);
      return;
    }

    const matchedDiscoverable = DISCOVERABLE_GROUPS.find(
      (dg) => dg.title.toLowerCase() === cleanName.toLowerCase()
    );

    const newId = `t-${Date.now()}`;
    const nowTime = formatNowTime();
    const memberIds = matchedDiscoverable
      ? [CURRENT_USER_ID, ...matchedDiscoverable.memberIds]
      : [CURRENT_USER_ID, 'u-clara', 'u-kenji'];

    const newGroup: Thread = {
      id: newId,
      type: 'group',
      title: matchedDiscoverable ? matchedDiscoverable.title : cleanName,
      topic: matchedDiscoverable
        ? matchedDiscoverable.topic
        : `Joined group channel · ${cleanName}`,
      memberIds,
      unreadCount: 0,
      notificationLevel: 'all',
      lastActivity: nowTime,
      checklist: [],
    };

    const welcomeMessage: Message = {
      id: `m-${Date.now()}`,
      threadId: newId,
      senderId: matchedDiscoverable
        ? matchedDiscoverable.welcomeSenderId
        : 'u-clara',
      text: matchedDiscoverable
        ? matchedDiscoverable.welcomeText
        : `Welcome to ${cleanName}! Glad you joined the group.`,
      timestamp: nowTime,
      dayGroup: 'Today',
      reactions: [],
    };

    setThreads((prev) => [newGroup, ...prev]);
    setMessagesByThread((prev) => ({ ...prev, [newId]: [welcomeMessage] }));
    if (filter === 'direct' || filter === 'unread') {
      setFilter('all');
    }
    handleSelectThread(newId);
  };

  const otherMembers = activeThread.memberIds
    .filter((id) => id !== CURRENT_USER_ID)
    .map((id) => users[id])
    .filter(Boolean);

  const activeMemberCount = activeThread.memberIds.filter(
    (id) => users[id]?.status === 'online'
  ).length;

  const subtitleText =
    activeThread.type === 'group'
      ? `${activeThread.memberIds.length} members · ${activeMemberCount} active`
      : `${otherMembers[0]?.role ?? 'Member'} · ${
          otherMembers[0]?.status === 'online'
            ? 'Active'
            : otherMembers[0]?.status === 'idle'
            ? 'Idle'
            : 'Do not disturb'
        }`;

  const typingName = typingUserByThread[activeThread.id];
  const otherUsersList = Object.values(users).filter(
    (u) => u.id !== CURRENT_USER_ID
  );

  return (
    <div className="h-[100dvh] w-full bg-[#071B2B] text-[#EEEEEE] flex overflow-hidden">
      {/* Left Pane: Channel & Thread Navigation */}
      <div
        className={`${
          mobileShowChat ? 'hidden sm:flex' : 'flex'
        } w-full sm:w-auto h-full shrink-0`}
      >
        <ThreadSidebar
          threads={threads}
          messagesByThread={messagesByThread}
          users={users}
          currentUser={currentUser}
          activeThreadId={activeThread.id}
          filter={filter}
          searchQuery={sidebarSearch}
          onSelectThread={handleSelectThread}
          onChangeFilter={setFilter}
          onChangeSearch={setSidebarSearch}
          onUpdateStatus={handleUpdateStatus}
          onOpenNewThread={() => setNewThreadModalOpen(true)}
          onOpenJoinGroup={() => setJoinGroupModalOpen(true)}
          searchInputRef={sidebarSearchRef}
        />
      </div>

      {/* Center Pane: Active Conversation */}
      <main
        className={`${
          mobileShowChat ? 'flex' : 'hidden sm:flex'
        } flex-1 flex-col min-w-0 h-full bg-[#071B2B] relative`}
      >
        {/* Subtle ambient nocturnal glow at top */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-48 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 65% 100% at 50% 0%, rgba(22, 125, 141, 0.16), transparent 75%)',
          }}
        />

        {/* Pinned Frosted Header */}
        <header className="relative z-20 shrink-0 nocturne-dock-glass border-b border-[#B9E4E8]/[0.12] px-3 sm:px-6 h-[64px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileShowChat(false)}
              aria-label="Back to channels"
              className="sm:hidden w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-[#B9E4E8] hover:bg-[#0B2438]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {activeThread.type === 'group' ? (
              <GroupStackedAvatars
                users={otherMembers}
                knockoutColor="#071B2B"
              />
            ) : (
              <Avatar
                user={otherMembers[0] ?? currentUser}
                size="md"
                knockoutColor="#071B2B"
              />
            )}

            <div className="min-w-0">
              <h2 className="text-[17px] sm:text-[18px] font-semibold leading-[23px] tracking-[-0.01em] text-[#EEEEEE] truncate">
                {activeThread.title}
              </h2>
              <p className="text-[12px] text-[#EEEEEE]/55 truncate">
                {typingName ? (
                  <span className="text-[#B9E4E8] font-medium">
                    {typingName} is typing…
                  </span>
                ) : (
                  subtitleText
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setThreadSearchOpen((v) => !v)}
              aria-label="Search in conversation"
              title="Search in conversation"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                threadSearchOpen
                  ? 'bg-[#167D8D] text-[#EEEEEE]'
                  : 'text-[#B9E4E8] hover:bg-[#0B2438]'
              }`}
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label="Toggle channel details"
              title="Channel details"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                drawerOpen
                  ? 'bg-[#167D8D] text-[#EEEEEE]'
                  : 'text-[#B9E4E8] hover:bg-[#0B2438]'
              }`}
            >
              <PanelRight className="w-[18px] h-[18px]" />
            </button>
          </div>
        </header>

        {/* Optional In-Conversation Search Bar */}
        {threadSearchOpen && (
          <div className="relative z-10 px-4 sm:px-6 py-2.5 bg-[#071B2B]/95 border-b border-[#EEEEEE]/[0.06]">
            <div className="max-w-[840px] mx-auto relative flex items-center">
              <Search className="w-4 h-4 text-[#EEEEEE]/40 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={threadSearchQuery}
                onChange={(e) => setThreadSearchQuery(e.target.value)}
                placeholder={`Search messages in ${activeThread.title}...`}
                aria-label="Search messages in conversation"
                className="w-full h-9 pl-10 pr-24 rounded-full bg-[#0B2438] border border-[#167D8D]/30 text-[13px] text-[#EEEEEE] placeholder:text-[#EEEEEE]/40 focus:outline-none focus:border-[#167D8D]"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                {threadSearchQuery && (
                  <span className="text-[10.5px] tabular-mono text-[#B9E4E8]">
                    {visibleMessages.length} found
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setThreadSearchOpen(false);
                    setThreadSearchQuery('');
                  }}
                  aria-label="Close message search"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#EEEEEE]/60 hover:text-[#EEEEEE] hover:bg-[#10314A]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 pb-3 relative z-10">
          <div className="max-w-[840px] mx-auto">
            {visibleMessages.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-[16px] font-semibold text-[#EEEEEE]/85">
                  {threadSearchQuery
                    ? 'No matching messages'
                    : `Quiet start in ${activeThread.title}`}
                </p>
                <p className="text-[13.5px] text-[#EEEEEE]/50 mt-1.5 max-w-sm mx-auto">
                  {threadSearchQuery
                    ? 'Try another keyword or clear the message search.'
                    : activeThread.topic}
                </p>
              </div>
            ) : (
              visibleMessages.map((msg, idx) => {
                const prev = idx > 0 ? visibleMessages[idx - 1] : null;
                const next =
                  idx < visibleMessages.length - 1
                    ? visibleMessages[idx + 1]
                    : null;

                const showDayBreak = !prev || prev.dayGroup !== msg.dayGroup;
                const isFirstInCluster =
                  showDayBreak || !prev || prev.senderId !== msg.senderId;
                const isLastInCluster =
                  !next ||
                  next.dayGroup !== msg.dayGroup ||
                  next.senderId !== msg.senderId;

                const sender = users[msg.senderId] ?? currentUser;
                const isOutgoing = msg.senderId === CURRENT_USER_ID;
                const repliedMessage = msg.replyToId
                  ? activeMessages.find((m) => m.id === msg.replyToId)
                  : undefined;
                const repliedSender = repliedMessage
                  ? users[repliedMessage.senderId]
                  : undefined;

                return (
                  <React.Fragment key={msg.id}>
                    {showDayBreak && (
                      <div className="my-6 flex items-center gap-3 select-none">
                        <div className="flex-1 border-t border-[#EEEEEE]/[0.06]" />
                        <span className="text-[10.5px] tabular-mono text-[#EEEEEE]/42 px-1">
                          {msg.dayGroup}
                        </span>
                        <div className="flex-1 border-t border-[#EEEEEE]/[0.06]" />
                      </div>
                    )}

                    <MessageBubble
                      message={msg}
                      sender={sender}
                      isOutgoing={isOutgoing}
                      isFirstInCluster={isFirstInCluster}
                      isLastInCluster={isLastInCluster}
                      isGroupThread={activeThread.type === 'group'}
                      currentUserId={CURRENT_USER_ID}
                      repliedMessage={repliedMessage}
                      repliedSender={repliedSender}
                      searchHighlight={threadSearchQuery}
                      onToggleReaction={handleToggleReaction}
                      onReply={setReplyingTo}
                    />
                  </React.Fragment>
                );
              })
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>

        {/* Bottom Floating Frosted Glass Composer */}
        <ComposerDock
          threadTitle={activeThread.title}
          replyingTo={replyingTo}
          replyingSender={
            replyingTo ? users[replyingTo.senderId] : undefined
          }
          onCancelReply={() => setReplyingTo(null)}
          onSendMessage={handleSendMessage}
        />
      </main>

      {/* Right Pane: Info / Checklist / Media Drawer */}
      <ChannelInfoDrawer
        thread={activeThread}
        messages={activeMessages}
        users={users}
        currentUserId={CURRENT_USER_ID}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onToggleChecklistItem={handleToggleChecklistItem}
        onAddChecklistItem={handleAddChecklistItem}
        onChangeNotificationLevel={handleChangeNotificationLevel}
      />

      {/* New Thread / Group Modal */}
      <NewThreadModal
        isOpen={newThreadModalOpen}
        users={otherUsersList}
        onClose={() => setNewThreadModalOpen(false)}
        onCreateThread={handleCreateThread}
      />

      {/* Join Group Modal */}
      <JoinGroupModal
        isOpen={joinGroupModalOpen}
        existingThreads={threads}
        onClose={() => setJoinGroupModalOpen(false)}
        onJoinGroup={handleJoinGroup}
      />
    </div>
  );
}
