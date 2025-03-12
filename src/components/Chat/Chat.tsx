import React, { useState } from 'react';
import styles from './Chat.module.scss';
import cn from 'classnames';
import { marked } from 'marked';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) {
      return;
    }

    const userMessageObj: Message = { sender: 'user', text: userMessage };

    setMessages(prev => [...prev, userMessageObj]);
    setIsSending(true);
    setUserMessage('');

    try {
      const encodedMessage = encodeURIComponent(userMessage);
      const response = await fetch(
        `https://dewvdtfd5m.execute-api.eu-north-1.amazonaws.com/dev/chat?message=${encodedMessage}`,
        { method: 'GET' },
      );

      if (!response.ok) {
        new Error('Something went wrong');
      }

      const assistantResponseText = await response.text();

      const assistantMessageObj: Message = {
        sender: 'assistant',
        text: assistantResponseText,
      };

      setMessages(prev => [...prev, assistantMessageObj]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsSending(false);
    }

    setUserMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (msg: Message, index: number) => {
    if (msg.sender === 'assistant') {
      const htmlContent = marked(msg.text) as string;

      return (
        <div
          key={index}
          className={cn(styles.chat__message, {
            [styles['chat__message--assistant']]: msg.sender === 'assistant',
          })}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    }

    return (
      <div
        key={index}
        className={cn(styles.chat__message, {
          [styles['chat__message--user']]: msg.sender === 'user',
        })}
      >
        {msg.text}
      </div>
    );
  };

  return (
    <div className={styles.chat}>
      <div className={styles.chat__messages}>{messages.map(renderMessage)}</div>
      <div className={styles.chat__input}>
        <textarea
          className={styles.chat__textarea}
          value={userMessage}
          onChange={e => setUserMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          rows={2}
          maxLength={600}
        />
        <div className={styles.chat__line}></div>
        <div className={styles['chat__button-shell']}>
          <button
            onClick={handleSendMessage}
            className={cn(styles.chat__button, {
              [styles['chat__button--disabled']]: isSending,
            })}
            disabled={isSending}
          >
            <span>{isSending ? 'Sending' : 'Send'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
