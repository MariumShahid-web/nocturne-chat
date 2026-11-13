import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Mic, Plus, X } from 'lucide-react';
import { Message, NotificationLevel, Thread, User } from '../types/chat';
import { Avatar, GroupStackedAvatars } from './Avatar';
import { NocturneCheckbox, NocturneRadio } from './Controls';

interface ChannelInfoDrawerProps {
  thread: Thread;
  messages: Message[];
  users: Record<string, User>;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onToggleChecklistItem: (threadId: string, itemId: string) => void;
  onAddChecklistItem: (threadId: string, label: string) => void;
  onChangeNotificationLevel: (threadId: string, level: NotificationLevel) => void;
}

type DrawerTab = 'overview' | 'checklist' | 'media';

const STATUS_LABEL: Record<User['status'], string> = {
  online: 'Active',
  idle: 'Idle',
  dnd: 'Do not disturb',
};

export const ChannelInfoDrawer: React.FC<ChannelInfoDrawerProps> = ({
  thread,
  messages,
  users,
  currentUserId,
  isOpen,
  onClose,
  onToggleChecklistItem,
  onAddChecklistItem,
  onChangeNotificationLevel,
}) => {
  const [tab, setTab] = useState<DrawerTab>('overview');
  const [newTaskText, setNewTaskText] = useState('');

  if (!isOpen) return null;

  const members = thread.memberIds.map((id) => users[id]).filter(Boolean);
  const otherMembers = members.filter((m) => m.id !== currentUserId);
  const sharedMediaMessages = messages.filter((m) => Boolean(m.attachment));
  const completedCount = thread.checklist.filter((c) => c.completed).length;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTaskText.trim();
    if (!trimmed) return;
    onAddChecklistItem(thread.id, trimmed);
    setNewTaskText('');
  };

  return (
    <>
      {/* Backdrop on mobile/tablet */}
      <div
        className="fixed inset-0 z-30 bg-[#071B2B]/60 backdrop-blur-xs lg:hidden"
        onClick={onClose}
      />

      <aside
        aria-label="Channel details"
        className="fixed right-0 top-0 bottom-0 z-40 w-full max-w-[340px] lg:static lg:w-[320px] shrink-0 bg-[#071B2B] border-l border-[#B9E4E8]/[0.12] flex flex-col h-full"
      >
        {/* Drawer Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#EEEEEE]/[0.06]">
          <h2 className="text-[17px] font-semibold leading-[24px] text-[#EEEEEE]">
            Channel Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close channel details"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#EEEEEE]/60 hover:text-[#EEEEEE] hover:bg-[#0B2438] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thread Identity Summary */}
        <div className="px-5 py-4 border-b border-[#EEEEEE]/[0.06] flex items-center gap-3.5">
          {thread.type === 'group' ? (
            <GroupStackedAvatars users={otherMembers} knockoutColor="#071B2B" />
          ) : (
            <Avatar user={otherMembers[0] ?? users[currentUserId]} size="lg" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold text-[#EEEEEE] truncate">
              {thread.title}
            </p>
            <p className="text-[12px] text-[#EEEEEE]/55 mt-0.5">
              {thread.type === 'group' ? 'Group channel' : 'Direct message'}
              <span aria-hidden="true"> · </span>
              <span className="tabular-mono">{members.length} members</span>
            </p>
          </div>
        </div>

        {/* Drawer Segmented Tabs */}
        <div className="px-4 py-2.5 border-b border-[#EEEEEE]/[0.06] flex items-center gap-1.5">
          {(
            [
              { key: 'overview', label: 'Overview' },
              { key: 'checklist', label: `Checklist (${completedCount}/${thread.checklist.length})` },
              { key: 'media', label: `Media (${sharedMediaMessages.length})` },
            ] as { key: DrawerTab; label: string }[]
          ).map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`h-8 px-2.5 rounded-full text-[11.5px] tabular-mono whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#167D8D] text-[#EEEEEE] font-semibold'
                    : 'bg-[#0B2438] text-[#EEEEEE]/70 border border-[#EEEEEE]/10 hover:text-[#EEEEEE]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {tab === 'overview' && (
            <>
              <div>
                <h3 className="text-[12px] tabular-mono text-[#B9E4E8]/80 mb-1.5">
                  Topic
                </h3>
                <p className="text-[13.5px] leading-[20px] text-[#EEEEEE]/80">
                  {thread.topic}
                </p>
              </div>

              <div className="border-t border-[#EEEEEE]/[0.06] pt-4">
                <h3 className="text-[12px] tabular-mono text-[#B9E4E8]/80 mb-2">
                  Notifications
                </h3>
                <div role="radiogroup" aria-label="Notification preferences">
                  <NocturneRadio
                    name={`notif-${thread.id}`}
                    value="all"
                    checked={thread.notificationLevel === 'all'}
                    onChange={() => onChangeNotificationLevel(thread.id, 'all')}
                    label="All messages"
                    description="Receive chime and unread badge for every reply"
                  />
                  <NocturneRadio
                    name={`notif-${thread.id}`}
                    value="mentions"
                    checked={thread.notificationLevel === 'mentions'}
                    onChange={() => onChangeNotificationLevel(thread.id, 'mentions')}
                    label="Mentions only"
                    description="Notify only when @marium is tagged"
                  />
                  <NocturneRadio
                    name={`notif-${thread.id}`}
                    value="muted"
                    checked={thread.notificationLevel === 'muted'}
                    onChange={() => onChangeNotificationLevel(thread.id, 'muted')}
                    label="Muted"
                    description="Keep thread quiet until manually opened"
                  />
                </div>
              </div>

              <div className="border-t border-[#EEEEEE]/[0.06] pt-4">
                <h3 className="text-[12px] tabular-mono text-[#B9E4E8]/80 mb-3">
                  Members
                </h3>
                <div className="space-y-2.5">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 py-1"
                    >
                      <Avatar user={member} size="sm" knockoutColor="#071B2B" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-medium text-[#EEEEEE] truncate">
                          {member.name}
                          {member.id === currentUserId && (
                            <span className="text-[#EEEEEE]/45 font-normal"> (You)</span>
                          )}
                        </p>
                        <p className="text-[11.5px] text-[#EEEEEE]/50 truncate">
                          {member.role} · {STATUS_LABEL[member.status]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'checklist' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[12px] tabular-mono text-[#B9E4E8]/80">
                    Session Checklist
                  </h3>
                  <span className="text-[11px] tabular-mono text-[#EEEEEE]/50">
                    {completedCount} of {thread.checklist.length} done
                  </span>
                </div>

                {thread.checklist.length === 0 ? (
                  <p className="text-[13px] text-[#EEEEEE]/55 py-4">
                    No action items yet. Add one below for the group.
                  </p>
                ) : (
                  <div className="space-y-0.5">
                    {thread.checklist.map((item) => {
                      const assignee = item.assigneeId ? users[item.assigneeId] : null;
                      return (
                        <NocturneCheckbox
                          key={item.id}
                          checked={item.completed}
                          onChange={() => onToggleChecklistItem(thread.id, item.id)}
                          label={item.label}
                          sublabel={assignee ? `Assigned to ${assignee.name}` : undefined}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              <form onSubmit={handleAddTask} className="pt-2 border-t border-[#EEEEEE]/[0.06]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add shared action item..."
                    aria-label="Add shared action item"
                    className="flex-1 h-10 px-3.5 rounded-full bg-[#0B2438] border border-[#167D8D]/25 text-[13px] text-[#EEEEEE] placeholder:text-[#EEEEEE]/40 focus:outline-none focus:border-[#167D8D]"
                  />
                  <button
                    type="submit"
                    aria-label="Add item"
                    className="w-10 h-10 rounded-full bg-[#167D8D] text-[#EEEEEE] flex items-center justify-center shrink-0 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {tab === 'media' && (
            <div className="space-y-2.5">
              <h3 className="text-[12px] tabular-mono text-[#B9E4E8]/80 mb-2">
                Shared Files & Stems
              </h3>
              {sharedMediaMessages.length === 0 ? (
                <p className="text-[13px] text-[#EEEEEE]/55 py-4">
                  No attachments shared in this conversation yet.
                </p>
              ) : (
                sharedMediaMessages.map((msg) => {
                  const att = msg.attachment!;
                  const sender = users[msg.senderId];
                  return (
                    <div
                      key={msg.id}
                      className="p-3 rounded-xl bg-[#0B2438] border border-[#EEEEEE]/[0.08] flex items-center gap-3"
                    >
                      <span className="w-9 h-9 rounded-lg bg-[#10314A] text-[#B9E4E8] flex items-center justify-center shrink-0">
                        {att.type === 'audio' ? (
                          <Mic className="w-4 h-4" />
                        ) : att.type === 'visual' ? (
                          <ImageIcon className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-[#EEEEEE] truncate">
                          {att.name}
                        </p>
                        <p className="text-[11px] tabular-mono text-[#EEEEEE]/50 truncate">
                          {att.duration ?? att.size} · {sender?.name.split(' ')[0]} · {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
