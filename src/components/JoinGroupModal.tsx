import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Users, X } from 'lucide-react';
import { DISCOVERABLE_GROUPS } from '../data/initialData';
import { Thread } from '../types/chat';

interface JoinGroupModalProps {
  isOpen: boolean;
  existingThreads: Thread[];
  onClose: () => void;
  onJoinGroup: (groupName: string) => void;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  isOpen,
  existingThreads,
  onClose,
  onJoinGroup,
}) => {
  const [groupName, setGroupName] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setGroupName('');
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const trimmed = groupName.trim();
  const alreadyJoined = existingThreads.some(
    (t) =>
      t.type === 'group' &&
      t.title.toLowerCase() === trimmed.toLowerCase()
  );

  const availableSuggestions = DISCOVERABLE_GROUPS.filter(
    (dg) =>
      !existingThreads.some(
        (t) => t.type === 'group' && t.title.toLowerCase() === dg.title.toLowerCase()
      )
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    onJoinGroup(trimmed);
    setGroupName('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B2B]/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-group-title"
    >
      <div className="w-full max-w-md rounded-2xl nocturne-glass border border-[#B9E4E8]/15 nocturne-halo overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#EEEEEE]/[0.08]">
          <h2 id="join-group-title" className="text-[18px] font-semibold text-[#EEEEEE]">
            Join a Group
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close join group dialog"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#EEEEEE]/60 hover:text-[#EEEEEE] hover:bg-[#0B2438]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label
              htmlFor="join-group-name-input"
              className="block text-[12px] tabular-mono text-[#B9E4E8]/85 mb-1.5"
            >
              Group name
            </label>
            <input
              ref={inputRef}
              id="join-group-name-input"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full h-11 px-4 rounded-xl bg-[#0B2438] border border-[#167D8D]/35 text-[14px] text-[#EEEEEE] placeholder:text-[#EEEEEE]/40 focus:outline-none focus:border-[#167D8D] transition-colors"
            />
            {alreadyJoined && trimmed && (
              <p className="mt-1.5 text-[12px] text-[#B9E4E8]">
                You are already in this group. Joining will open the conversation.
              </p>
            )}
          </div>

          {availableSuggestions.length > 0 && (
            <div className="pt-2 border-t border-[#EEEEEE]/[0.08]">
              <p className="text-[11.5px] tabular-mono text-[#EEEEEE]/55 mb-2">
                Open groups nearby
              </p>
              <div className="space-y-1.5">
                {availableSuggestions.map((group) => (
                  <button
                    key={group.title}
                    type="button"
                    onClick={() => setGroupName(group.title)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B2438]/75 hover:bg-[#0B2438] border border-[#EEEEEE]/[0.07] hover:border-[#167D8D]/40 flex items-center justify-between gap-3 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-[28%] bg-[#167D8D]/25 text-[#B9E4E8] flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-[#EEEEEE] truncate">
                          {group.title}
                        </p>
                        <p className="text-[11.5px] text-[#EEEEEE]/55 truncate">
                          {group.memberIds.length} members · {group.topic}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B9E4E8]/70 shrink-0" />
                  </button>
                ))}
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
              disabled={!trimmed}
              className={`h-10 px-5 rounded-full text-[13.5px] font-semibold bg-[#167D8D] text-[#EEEEEE] transition-all ${
                trimmed
                  ? 'hover:brightness-110 active:scale-[0.97]'
                  : 'opacity-45 cursor-not-allowed'
              }`}
            >
              {alreadyJoined ? 'Open Group' : 'Join Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
