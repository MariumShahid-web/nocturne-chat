import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCheck,
  Copy,
  FileText,
  Pause,
  Play,
  Reply,
  SmilePlus,
} from 'lucide-react';
import { QUICK_EMOJIS } from '../data/initialData';
import { Message, User } from '../types/chat';
import { Avatar } from './Avatar';

interface MessageBubbleProps {
  message: Message;
  sender: User;
  isOutgoing: boolean;
  isFirstInCluster: boolean;
  isLastInCluster: boolean;
  isGroupThread: boolean;
  currentUserId: string;
  repliedMessage?: Message;
  repliedSender?: User;
  searchHighlight?: string;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onReply: (message: Message) => void;
}

function getBubbleRadiusClass(
  isOutgoing: boolean,
  isFirst: boolean,
  isLast: boolean
): string {
  if (isFirst && isLast) return 'rounded-[16px]';
  if (isOutgoing) {
    if (isFirst) return 'rounded-[16px] rounded-br-[4px]';
    if (isLast) return 'rounded-[16px] rounded-tr-[4px]';
    return 'rounded-[16px] rounded-tr-[4px] rounded-br-[4px]';
  }
  if (isFirst) return 'rounded-[16px] rounded-bl-[4px]';
  if (isLast) return 'rounded-[16px] rounded-tl-[4px]';
  return 'rounded-[16px] rounded-tl-[4px] rounded-bl-[4px]';
}

function highlightText(text: string, query?: string): React.ReactNode {
  if (!query || !query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, idx) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={idx}
        className="bg-[#167D8D]/40 text-inherit rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  isOutgoing,
  isFirstInCluster,
  isLastInCluster,
  isGroupThread,
  currentUserId,
  repliedMessage,
  repliedSender,
  searchHighlight,
  onToggleReaction,
  onReply,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    if (!isPlayingAudio) return;
    const interval = window.setInterval(() => {
      setAudioProgress((prev) => {
        if (prev >= 100) {
          setIsPlayingAudio(false);
          return 0;
        }
        return prev + 4;
      });
    }, 140);
    return () => window.clearInterval(interval);
  }, [isPlayingAudio]);

  const hasReactions = message.reactions.length > 0;
  const radiusClass = getBubbleRadiusClass(
    isOutgoing,
    isFirstInCluster,
    isLastInCluster
  );

  const spacingClass = isFirstInCluster ? 'mt-3' : 'mt-1';
  const reactionSpacing = hasReactions ? 'mb-3.5' : '';

  const handleCopyCode = () => {
    if (!message.codeSnippet) return;
    navigator.clipboard?.writeText(message.codeSnippet).catch(() => {});
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 1600);
  };

  return (
    <div
      className={`group flex items-end gap-2.5 ${
        isOutgoing ? 'justify-end' : 'justify-start'
      } ${spacingClass} ${reactionSpacing}`}
    >
      {/* Incoming Avatar Slot (always reserve 32px width in group threads for clean column alignment) */}
      {!isOutgoing && isGroupThread && (
        <div className="w-8 shrink-0 flex items-end">
          {isLastInCluster ? (
            <Avatar user={sender} size="sm" showStatus={true} knockoutColor="#071B2B" />
          ) : (
            <div className="w-8" aria-hidden="true" />
          )}
        </div>
      )}

      {/* Outgoing hover controls (left side of bubble) */}
      {isOutgoing && (
        <div className="relative flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 self-center">
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            aria-label="Add reaction"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#EEEEEE]/55 hover:text-[#B9E4E8] hover:bg-[#0B2438] transition-colors"
          >
            <SmilePlus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onReply(message)}
            aria-label="Reply to message"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#EEEEEE]/55 hover:text-[#B9E4E8] hover:bg-[#0B2438] transition-colors"
          >
            <Reply className="w-4 h-4" />
          </button>

          {pickerOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setPickerOpen(false)}
              />
              <div className="absolute right-0 bottom-10 z-30 flex items-center gap-1 px-2 py-1.5 rounded-full nocturne-glass border border-[#B9E4E8]/15 nocturne-halo">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onToggleReaction(message.id, emoji);
                      setPickerOpen(false);
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[15px] hover:bg-[#167D8D]/30 transition-transform hover:scale-110"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Message Bubble Container */}
      <div className="relative max-w-[78%] sm:max-w-[72%] lg:max-w-[66%]">
        <div
          className={`px-3.5 py-2.5 ${radiusClass} ${
            isOutgoing
              ? 'bg-[#B9E4E8] text-[#071B2B]'
              : 'bg-[#0E2A40] text-[#EEEEEE] border border-[#EEEEEE]/[0.08]'
          }`}
        >
          {/* Author Alias on Incoming Group Cluster Start */}
          {!isOutgoing && isGroupThread && isFirstInCluster && (
            <div className="text-[14px] font-semibold leading-[19px] tracking-[-0.005em] text-[#B9E4E8] mb-1">
              {sender.name}
            </div>
          )}

          {/* Replied-To Quote Box */}
          {repliedMessage && repliedSender && (
            <div
              className={`mb-2 px-2.5 py-1.5 rounded-lg text-[12px] leading-[16px] ${
                isOutgoing
                  ? 'bg-[#071B2B]/[0.08] text-[#071B2B]/85 border border-[#071B2B]/10'
                  : 'bg-[#071B2B]/50 text-[#EEEEEE]/80 border border-[#B9E4E8]/15'
              }`}
            >
              <span className="font-semibold block text-[11px]">
                {repliedSender.name}
              </span>
              <span className="line-clamp-1 opacity-85">
                {repliedMessage.text || repliedMessage.attachment?.name}
              </span>
            </div>
          )}

          {/* Visual Attachment (Local SVG Study) */}
          {message.attachment?.type === 'visual' && (
            <div className="mb-2 rounded-xl overflow-hidden border border-[#EEEEEE]/10 bg-[#071B2B]">
              <svg
                viewBox="0 0 320 148"
                className="w-full h-36 block"
                role="img"
                aria-label={message.attachment.visualCaption ?? message.attachment.name}
              >
                <defs>
                  <linearGradient id={`sky-${message.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#071B2B" />
                    <stop offset="65%" stopColor="#0E2A40" />
                    <stop offset="100%" stopColor="#167D8D" stopOpacity="0.65" />
                  </linearGradient>
                  <radialGradient id={`glow-${message.id}`} cx="72%" cy="32%" r="45%">
                    <stop offset="0%" stopColor="#B9E4E8" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#167D8D" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="320" height="148" fill={`url(#sky-${message.id})`} />
                <rect width="320" height="148" fill={`url(#glow-${message.id})`} />
                <path
                  d="M0 98 Q 65 82, 130 96 T 260 92 T 320 98 L 320 148 L 0 148 Z"
                  fill="#0B2438"
                  fillOpacity="0.88"
                />
                <path
                  d="M0 112 Q 80 100, 160 112 T 320 110 L 320 148 L 0 148 Z"
                  fill="#167D8D"
                  fillOpacity="0.32"
                />
                <path
                  d="M36 96 L 82 54 L 184 54 L 228 96"
                  fill="none"
                  stroke="#B9E4E8"
                  strokeOpacity="0.45"
                  strokeWidth="1.2"
                />
                <circle cx="232" cy="46" r="10" fill="#B9E4E8" fillOpacity="0.85" />
              </svg>
              <div className="px-3 py-2 flex items-center justify-between gap-2 bg-[#0B2438] text-[#EEEEEE]">
                <span className="text-[12px] font-medium truncate">
                  {message.attachment.visualCaption ?? message.attachment.name}
                </span>
                <span className="text-[10.5px] tabular-mono text-[#EEEEEE]/55 shrink-0">
                  {message.attachment.size}
                </span>
              </div>
            </div>
          )}

          {/* Audio Waveform Attachment */}
          {message.attachment?.type === 'audio' && (
            <div
              className={`mb-2 px-3 py-2.5 rounded-xl flex items-center gap-3 ${
                isOutgoing
                  ? 'bg-[#071B2B]/10'
                  : 'bg-[#071B2B]/55 border border-[#EEEEEE]/[0.06]'
              }`}
            >
              <button
                type="button"
                onClick={() => setIsPlayingAudio((p) => !p)}
                aria-label={isPlayingAudio ? 'Pause audio' : 'Play audio'}
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
                  isOutgoing
                    ? 'bg-[#167D8D] text-[#EEEEEE]'
                    : 'bg-[#167D8D] text-[#EEEEEE]'
                }`}
              >
                {isPlayingAudio ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[3px] h-7">
                  {(message.attachment.waveform ?? []).map((bar, idx, arr) => {
                    const threshold = ((idx + 1) / arr.length) * 100;
                    const activeBar = audioProgress >= threshold;
                    return (
                      <span
                        key={idx}
                        className="flex-1 rounded-full transition-colors duration-150"
                        style={{
                          height: `${Math.max(20, bar)}%`,
                          backgroundColor: isOutgoing
                            ? activeBar
                              ? '#071B2B'
                              : 'rgba(7, 27, 43, 0.32)'
                            : activeBar
                            ? '#B9E4E8'
                            : 'rgba(185, 228, 232, 0.3)',
                        }}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-[10.5px] tabular-mono truncate ${
                      isOutgoing ? 'text-[#071B2B]/75' : 'text-[#EEEEEE]/60'
                    }`}
                  >
                    {message.attachment.name}
                  </span>
                  <span
                    className={`text-[10.5px] tabular-mono shrink-0 ml-2 ${
                      isOutgoing ? 'text-[#167D8D]' : 'text-[#B9E4E8]'
                    }`}
                  >
                    {message.attachment.duration}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* File Attachment */}
          {message.attachment?.type === 'file' && (
            <div
              className={`mb-2 px-3 py-2.5 rounded-xl flex items-center gap-3 ${
                isOutgoing
                  ? 'bg-[#071B2B]/10'
                  : 'bg-[#071B2B]/55 border border-[#EEEEEE]/[0.06]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isOutgoing
                    ? 'bg-[#167D8D] text-[#EEEEEE]'
                    : 'bg-[#10314A] text-[#B9E4E8]'
                }`}
              >
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[13px] font-medium truncate ${
                    isOutgoing ? 'text-[#071B2B]' : 'text-[#EEEEEE]'
                  }`}
                >
                  {message.attachment.name}
                </p>
                <p
                  className={`text-[10.5px] tabular-mono ${
                    isOutgoing ? 'text-[#071B2B]/70' : 'text-[#EEEEEE]/50'
                  }`}
                >
                  {message.attachment.size}
                </p>
              </div>
            </div>
          )}

          {/* Body Text */}
          {message.text && (
            <p
              className={`text-[14px] leading-[20.5px] whitespace-pre-wrap break-words ${
                isOutgoing ? 'font-medium text-[#071B2B]' : 'font-normal text-[#EEEEEE]'
              }`}
            >
              {highlightText(message.text, searchHighlight)}
            </p>
          )}

          {/* Optional Monospace Code Snippet */}
          {message.codeSnippet && (
            <div className="mt-2 rounded-xl overflow-hidden bg-[#071B2B] border border-[#167D8D]/30 text-[#EEEEEE]">
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-[#EEEEEE]/[0.06] bg-[#0B2438]">
                <span className="text-[10.5px] tabular-mono text-[#B9E4E8]/80">
                  Snippet
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[10.5px] tabular-mono text-[#EEEEEE]/70 hover:text-[#B9E4E8] transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-[#00D68F]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-[12px] leading-[17px] font-mono overflow-x-auto text-[#B9E4E8]">
                <code>{message.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Timestamp & Read Indicator Row */}
          <div className="mt-1 flex items-center justify-end gap-1.5 select-none">
            <span
              className={`text-[10.5px] leading-[14px] tabular-mono ${
                isOutgoing ? 'text-[#167D8D]' : 'text-[#EEEEEE]/50'
              }`}
            >
              {message.timestamp}
            </span>
            {isOutgoing && (
              <span
                className="text-[#167D8D]"
                aria-label={message.status === 'read' ? 'Read' : 'Delivered'}
              >
                {message.status === 'read' ? (
                  <CheckCheck className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Overlapping Reaction Pill Cluster */}
        {hasReactions && (
          <div
            className={`relative -mt-2.5 z-10 flex flex-wrap items-center gap-1 px-2 ${
              isOutgoing ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.reactions.map((reaction) => {
              const userReacted = reaction.userIds.includes(currentUserId);
              return (
                <button
                  key={reaction.emoji}
                  type="button"
                  onClick={() => onToggleReaction(message.id, reaction.emoji)}
                  className={`h-6 px-2 rounded-full flex items-center gap-1 text-[11px] tabular-mono transition-colors ${
                    userReacted
                      ? 'bg-[#10314A] border border-[#B9E4E8]/60 text-[#EEEEEE]'
                      : 'bg-[#071B2B] border border-[#167D8D]/40 text-[#EEEEEE] hover:border-[#167D8D]'
                  }`}
                >
                  <span className="text-[12px] leading-none">{reaction.emoji}</span>
                  <span>{reaction.userIds.length}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Incoming hover controls (right side of bubble) */}
      {!isOutgoing && (
        <div className="relative flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 self-center">
          <button
            type="button"
            onClick={() => onReply(message)}
            aria-label="Reply to message"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#EEEEEE]/55 hover:text-[#B9E4E8] hover:bg-[#0B2438] transition-colors"
          >
            <Reply className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            aria-label="Add reaction"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#EEEEEE]/55 hover:text-[#B9E4E8] hover:bg-[#0B2438] transition-colors"
          >
            <SmilePlus className="w-4 h-4" />
          </button>

          {pickerOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setPickerOpen(false)}
              />
              <div className="absolute left-0 bottom-10 z-30 flex items-center gap-1 px-2 py-1.5 rounded-full nocturne-glass border border-[#B9E4E8]/15 nocturne-halo">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onToggleReaction(message.id, emoji);
                      setPickerOpen(false);
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[15px] hover:bg-[#167D8D]/30 transition-transform hover:scale-110"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
