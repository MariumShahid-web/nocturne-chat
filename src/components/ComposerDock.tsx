import React, { useEffect, useRef, useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Send,
  Smile,
  Square,
  X,
} from 'lucide-react';
import { QUICK_EMOJIS, SAMPLE_ATTACHMENTS } from '../data/initialData';
import { Message, MessageAttachment, User } from '../types/chat';

interface ComposerDockProps {
  threadTitle: string;
  replyingTo: Message | null;
  replyingSender?: User;
  onCancelReply: () => void;
  onSendMessage: (text: string, attachment?: MessageAttachment) => void;
}

export const ComposerDock: React.FC<ComposerDockProps> = ({
  threadTitle,
  replyingTo,
  replyingSender,
  onCancelReply,
  onSendMessage,
}) => {
  const [text, setText] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isRecording) return;
    const id = window.setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRecording]);

  useEffect(() => {
    if (replyingTo) {
      textareaRef.current?.focus();
    }
  }, [replyingTo]);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && !pendingAttachment) return;
    onSendMessage(trimmed, pendingAttachment ?? undefined);
    setText('');
    setPendingAttachment(null);
    setEmojiOpen(false);
    setAttachOpen(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setRecordSeconds(0);
      setIsRecording(true);
      setEmojiOpen(false);
      setAttachOpen(false);
    } else {
      const secs = Math.max(2, recordSeconds);
      const formatted = `0:${secs < 10 ? `0${secs}` : secs}`;
      setPendingAttachment({
        id: `att-${Date.now()}`,
        type: 'audio',
        name: `voice_note_${formatted.replace(':', '')}.wav`,
        size: `${Math.max(120, secs * 48)} KB`,
        duration: formatted,
        waveform: [
          22, 40, 65, 48, 72, 85, 58, 36, 62, 76, 50, 34, 68, 80, 44, 30, 56, 70, 46, 32, 24, 38,
        ],
      });
      setIsRecording(false);
      setRecordSeconds(0);
    }
  };

  const canSend = text.trim().length > 0 || pendingAttachment !== null;

  return (
    <div className="px-3 sm:px-6 pb-3 sm:pb-5 pt-2 shrink-0 relative z-20">
      <div className="max-w-[840px] mx-auto relative">
        {/* Emoji Popover */}
        {emojiOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setEmojiOpen(false)} />
            <div className="absolute right-12 bottom-full mb-2.5 z-20 p-2 rounded-2xl nocturne-glass border border-[#B9E4E8]/15 nocturne-halo flex items-center gap-1">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setText((prev) => `${prev}${emoji}`);
                    textareaRef.current?.focus();
                  }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] hover:bg-[#167D8D]/25 transition-transform hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Attachment Popover */}
        {attachOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setAttachOpen(false)} />
            <div className="absolute left-0 bottom-full mb-2.5 z-20 w-72 p-2 rounded-2xl nocturne-glass border border-[#B9E4E8]/15 nocturne-halo">
              <p className="px-2.5 py-1.5 text-[11px] tabular-mono text-[#EEEEEE]/55">
                Attach studio artifact
              </p>
              <div className="space-y-1">
                {SAMPLE_ATTACHMENTS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setPendingAttachment({
                        ...item,
                        id: `att-${Date.now()}`,
                      });
                      setAttachOpen(false);
                      textareaRef.current?.focus();
                    }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-[#0B2438] text-left transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#167D8D]/25 text-[#B9E4E8] flex items-center justify-center shrink-0">
                      {item.type === 'visual' ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-[#EEEEEE] truncate">
                        {item.name}
                      </span>
                      <span className="block text-[10.5px] tabular-mono text-[#EEEEEE]/50">
                        {item.size}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Floating Frosted Glass Dock */}
        <form
          onSubmit={handleSubmit}
          className="nocturne-dock-glass nocturne-halo border border-[#B9E4E8]/15 rounded-[28px] p-2 transition-all"
        >
          {/* Reply Context Strip */}
          {replyingTo && replyingSender && (
            <div className="mx-2 mb-2 px-3 py-2 rounded-xl bg-[#0B2438] border border-[#167D8D]/25 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-[#B9E4E8] block">
                  Replying to {replyingSender.name}
                </span>
                <span className="text-[12.5px] text-[#EEEEEE]/70 truncate block">
                  {replyingTo.text || replyingTo.attachment?.name}
                </span>
              </div>
              <button
                type="button"
                onClick={onCancelReply}
                aria-label="Cancel reply"
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#EEEEEE]/55 hover:text-[#EEEEEE] hover:bg-[#10314A] shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Pending Attachment Chip */}
          {pendingAttachment && (
            <div className="mx-2 mb-2 px-3 py-2 rounded-xl bg-[#0B2438] border border-[#167D8D]/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-[#167D8D]/25 text-[#B9E4E8] flex items-center justify-center shrink-0">
                  {pendingAttachment.type === 'audio' ? (
                    <Mic className="w-3.5 h-3.5" />
                  ) : pendingAttachment.type === 'visual' ? (
                    <ImageIcon className="w-3.5 h-3.5" />
                  ) : (
                    <FileText className="w-3.5 h-3.5" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium text-[#EEEEEE] truncate">
                    {pendingAttachment.name}
                  </p>
                  <p className="text-[10.5px] tabular-mono text-[#EEEEEE]/50">
                    {pendingAttachment.duration ?? pendingAttachment.size}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingAttachment(null)}
                aria-label="Remove attachment"
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#EEEEEE]/55 hover:text-[#EEEEEE] hover:bg-[#10314A] shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Composer Row */}
          <div className="flex items-end gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setAttachOpen((v) => !v);
                setEmojiOpen(false);
              }}
              aria-label="Attach file"
              title="Attach file"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#B9E4E8] hover:bg-[#167D8D]/20 active:scale-95 transition-all shrink-0 focus-visible:outline-2 focus-visible:outline-[#B9E4E8]"
            >
              <Paperclip className="w-[18px] h-[18px]" />
            </button>

            <div className="flex-1 min-w-0 flex items-center rounded-[22px] bg-[#0B2438] border border-[#167D8D]/25 focus-within:border-[#167D8D]/70 transition-colors px-3.5 py-1.5">
              {isRecording ? (
                <div className="flex items-center justify-between w-full h-7">
                  <span className="flex items-center gap-2 text-[13px] font-medium text-[#EEEEEE]">
                    <span className="w-2 h-2 rounded-full bg-[#FF5C5C]" />
                    Recording voice note…
                  </span>
                  <span className="text-[12px] tabular-mono text-[#B9E4E8]">
                    0:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
                  </span>
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    adjustHeight();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${threadTitle}...`}
                  aria-label={`Message ${threadTitle}`}
                  className="w-full bg-transparent resize-none text-[14px] leading-[21px] text-[#EEEEEE] placeholder:text-[#EEEEEE]/40 focus:outline-none max-h-32 py-0.5"
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setEmojiOpen((v) => !v);
                setAttachOpen(false);
              }}
              aria-label="Insert emoji"
              title="Insert emoji"
              className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-[#B9E4E8] hover:bg-[#167D8D]/20 active:scale-95 transition-all shrink-0 focus-visible:outline-2 focus-visible:outline-[#B9E4E8]"
            >
              <Smile className="w-[18px] h-[18px]" />
            </button>

            <button
              type="button"
              onClick={handleToggleRecord}
              aria-label={isRecording ? 'Stop recording' : 'Record voice note'}
              title={isRecording ? 'Stop recording' : 'Record voice note'}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 focus-visible:outline-2 focus-visible:outline-[#B9E4E8] ${
                isRecording
                  ? 'bg-[#FF5C5C]/20 text-[#FF5C5C] hover:bg-[#FF5C5C]/30'
                  : 'text-[#B9E4E8] hover:bg-[#167D8D]/20 active:scale-95'
              }`}
            >
              {isRecording ? (
                <Square className="w-4 h-4 fill-current" />
              ) : (
                <Mic className="w-[18px] h-[18px]" />
              )}
            </button>

            {/* 36x36px Send Trigger wrapped in ergonomic tap target */}
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send message"
              title="Send message"
              className={`w-10 h-10 flex items-center justify-center rounded-full shrink-0 transition-all focus-visible:outline-2 focus-visible:outline-[#B9E4E8] ${
                canSend ? 'cursor-pointer' : 'cursor-not-allowed opacity-45'
              }`}
            >
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center bg-[#167D8D] text-[#EEEEEE] transition-all duration-150 ${
                  canSend
                    ? 'hover:brightness-110 active:scale-[0.94] active:shadow-[0_0_18px_rgba(22,125,141,0.65)]'
                    : ''
                }`}
              >
                <Send className="w-4 h-4 -ml-0.5" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
