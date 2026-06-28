import React from 'react';

interface AppleEmojiProps {
  symbol: string;
  className?: string;
}

export function AppleEmoji({ symbol, className = "w-6 h-6 inline-block align-text-bottom" }: AppleEmojiProps) {
  return (
    <img
      src={`https://emojicdn.elk.sh/${encodeURIComponent(symbol)}?style=apple`}
      alt={symbol}
      className={className}
      draggable={false}
    />
  );
}
