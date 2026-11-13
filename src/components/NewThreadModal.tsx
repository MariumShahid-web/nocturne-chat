import React, { useState } from 'react';
import { X } from 'lucide-react';
import { User } from '../types/chat';
import { NocturneCheckbox } from './Controls';

interface NewThreadModalProps {
  isOpen: boolean;
  users: User[];
  onClose: () => void;
  onCreateThread: (title: string, topic: string, memberIds: string[]) => void;
}

export const NewThreadModal: React.FC<NewThreadModalProps> = ({
  isOpen,
  users,
  onClose,
  onCreateThread,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');

  if (!isOpen) return null;

  const toggleMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isGroup = selectedIds.length > 1;
  const canCreate = selectedIds.length >= 1 && (!isGroup || title.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    const singleUser = users.find((u) => u.id === selectedIds[0]);
    const finalTitle = isGroup ? title.trim() : singleUser?.name ?? 'Direct Message';
    const finalTopic =
      topic.trim() ||
      (isGroup
        ? 'Focused evening collaboration space.'
        : `Direct thread with ${singleUser?.name ?? 'member'} · ${singleUser?.role ?? ''}`);

    onCreateThread(finalTitle, finalTopic, selectedIds);
    setSelectedIds([]);
    setTitle('');
    setTopic('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B2B]/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-thread-title"
    >
      <div className="w-full max-w-md rounded-2xl nocturne-glass border border-[#B9E4E8]/15 nocturne-halo overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#EEEEEE]/[0.08]">
          <h2 id="new-thread-title" className="text-[18px] font-semibold text-[#EEEEEE]">
            Start a Conversation
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#EEEEEE]/60 hover:text-[#EEEEEE] hover:bg-[#0B2438]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <p className="text-[12px] tabular-mono text-[#B9E4E8]/80 mb-2">
              Select people ({selectedIds.length} selected)
            </p>
            <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
              {users.map((u) => (
                <NocturneCheckbox
                  key={u.id}
                  checked={selectedIds.includes(u.id)}
                  onChange={() => toggleMember(u.id)}
                  label={u.name}
                  sublabel={`${u.role} · ${u.handle}`}
                />
              ))}
            </div>
          </div>

          {isGroup && (
            <div className="space-y-3 pt-2 border-t border-[#EEEEEE]/[0.08]">
              <div>
                <label
                  htmlFor="group-name-input"
                  className="block text-[12px] tabular-mono text-[#B9E4E8]/80 mb-1.5"
                >
                  Channel name
                </label>
                <input
                  id="group-name-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Solstice Acoustic Lab"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#0B2438] border border-[#167D8D]/30 text-[14px] text-[#EEEEEE] placeholder:text-[#EEEEEE]/40 focus:outline-none focus:border-[#167D8D]"
                />
              </div>
              <div>
                <label
                  htmlFor="group-topic-input"
                  className="block text-[12px] tabular-mono text-[#B9E4E8]/80 mb-1.5"
                >
                  Topic (optional)
                </label>
                <input
                  id="group-topic-input"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What is this channel focused on?"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#0B2438] border border-[#167D8D]/30 text-[14px] text-[#EEEEEE] placeholder:text-[#EEEEEE]/40 focus:outline-none focus:border-[#167D8D]"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-full text-[13.5px] font-medium text-[#EEEEEE]/75 hover:text-[#EEEEEE] hover:bg-[#0B2438] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canCreate}
              className={`h-10 px-5 rounded-full text-[13.5px] font-semibold bg-[#167D8D] text-[#EEEEEE] transition-all ${
                canCreate
                  ? 'hover:brightness-110 active:scale-[0.97]'
                  : 'opacity-45 cursor-not-allowed'
              }`}
            >
              {isGroup ? 'Create Group' : 'Open Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
