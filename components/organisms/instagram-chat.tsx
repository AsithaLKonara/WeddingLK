'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  MoreHorizontal,
  Phone,
  Video,
  Search,
  Filter,
  Image as ImageIcon,
  Smile,
  Paperclip,
  Mic,
  Check,
  CheckCheck,
  MessageCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  _id: string;
  _senderId: string;
  _content: string;
  timestamp: Date;
  _isRead: boolean;
  type: 'text' | 'image' | 'voice' | 'file';
  mediaUrl?: string;
  replyTo?: string;
}

interface ChatUser {
  _id: string;
  _name: string;
  _avatar: string;
  _isOnline: boolean;
  lastSeen?: Date;
  _unreadCount: number;
  _isTyping: boolean;
}

interface Conversation {
  _id: string;
  user: ChatUser;
  lastMessage: ChatMessage;
  _unreadCount: number;
  _isPinned: boolean;
  _isMuted: boolean;
}

export default function InstagramChat() {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        user: {
          id: 'user1',
          name: 'Sarah & Mike',
          avatar: '/avatars/couple1.jpg',
          isOnline: true,
          unreadCount: 2,
          isTyping: false,
        },
        lastMessage: {
          id: 'msg1',
          senderId: 'user1',
          content: "Can't wait for our wedding day! 💕",
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          isRead: false,
          type: 'text',
        },
        unreadCount: 2,
        isPinned: true,
        isMuted: false,
      },
      {
        id: '2',
        user: {
          id: 'user2',
          name: 'Priya & David',
          avatar: '/avatars/couple2.jpg',
          isOnline: false,
          lastSeen: new Date(Date.now() - 1000 * 60 * 30),
          unreadCount: 0,
          isTyping: false,
        },
        lastMessage: {
          id: 'msg2',
          senderId: 'user2',
          content: 'The venue looks perfect!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          isRead: true,
          type: 'text',
        },
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
      },
    ];

    setConversations(mockConversations);
  }, []);

  // Mock messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const mockMessages: ChatMessage[] = [
        {
          id: 'msg1',
          senderId: 'user1',
          content: "Hi! We're so excited about our wedding planning!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          isRead: true,
          type: 'text',
        },
        {
          id: 'msg2',
          senderId: 'currentUser',
          content: "That's wonderful! I'm here to help make it perfect!",
          timestamp: new Date(Date.now() - 1000 * 60 * 55),
          isRead: true,
          type: 'text',
        },
        {
          id: 'msg3',
          senderId: 'user1',
          content: "Can't wait for our wedding day! 💕",
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          isRead: false,
          type: 'text',
        },
      ];
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: ChatMessage = {
      id: `msg${Date.now()}`,
      senderId: 'currentUser',
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: false,
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    toast({
      title: 'Message sent',
      description: 'Your message has been sent successfully.',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden'>
      {/* Conversations List */}
      <div className='w-80 border-r border-gray-200 flex flex-col'>
        {/* Header */}
        <div className='p-4 border-b border-gray-200'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold'>Messages</h2>
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='h-5 w-5' />
            </Button>
          </div>

          {/* Search */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <Input
              placeholder='Search messages...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className='flex-1'>
          <div className='space-y-1'>
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id
                    ? 'bg-blue-50 border-r-2 border-blue-500'
                    : ''
                }`}
              >
                <div className='flex items-center space-x-3'>
                  <div className='relative'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage src={conversation.user.avatar} />
                      <AvatarFallback>
                        {conversation.user.name
                          .split(' ')
                          .map((_n: any) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.user._isOnline && (
                      <div className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white' />
                    )}
                  </div>

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between'>
                      <h3 className='font-medium text-sm truncate'>
                        {conversation.user.name}
                      </h3>
                      <span className='text-xs text-gray-500'>
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <p className='text-sm text-gray-600 truncate flex-1'>
                        {conversation.user.isTyping ? (
                          <span className='text-blue-500 italic'>
                            typing...
                          </span>
                        ) : (
                          conversation.lastMessage.content
                        )}
                      </p>

                      {conversation.unreadCount > 0 && (
                        <Badge variant='secondary' className='ml-2 text-xs'>
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className='flex-1 flex flex-col'>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage
                    src={
                      conversations.find(c => c.id === selectedConversation)
                        ?.user.avatar
                    }
                  />
                  <AvatarFallback>
                    {conversations
                      .find(c => c.id === selectedConversation)
                      ?.user.name.split(' ')
                      .map((_n: any) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className='font-medium'>
                    {
                      conversations.find(c => c.id === selectedConversation)
                        ?.user.name
                    }
                  </h3>
                  <p className='text-sm text-gray-500'>
                    {conversations.find(c => c.id === selectedConversation)
                      ?.user._isOnline
                      ? 'Online'
                      : 'Last seen ' +
                        formatTime(
                          conversations.find(c => c.id === selectedConversation)
                            ?.user.lastSeen || new Date()
                        )}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <Button variant='ghost' size='sm'>
                  <Phone className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='sm'>
                  <Video className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='sm'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className='flex-1 p-4'>
              <div className='space-y-4'>
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        message.senderId === 'currentUser'
                          ? 'order-2'
                          : 'order-1'
                      }`}
                    >
                      {message.senderId !== 'currentUser' && (
                        <Avatar className='h-8 w-8 mb-1'>
                          <AvatarImage
                            src={
                              conversations.find(
                                c => c.id === selectedConversation
                              )?.user.avatar
                            }
                          />
                          <AvatarFallback>
                            {conversations
                              .find(c => c.id === selectedConversation)
                              ?.user.name.split(' ')
                              .map((_n: any) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`rounded-lg px-3 py-2 ${
                          message.senderId === 'currentUser'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className='text-sm'>{message.content}</p>
                      </div>

                      <div
                        className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${
                          message.senderId === 'currentUser'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <span>{formatTime(message.timestamp)}</span>
                        {message.senderId === 'currentUser' && (
                          <span>
                            {message.isRead ? (
                              <CheckCheck className='h-3 w-3 text-blue-500' />
                            ) : (
                              <Check className='h-3 w-3' />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className='p-4 border-t border-gray-200'>
              <div className='flex items-center space-x-2'>
                <Button variant='ghost' size='sm'>
                  <Paperclip className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='sm'>
                  <ImageIcon className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='sm'>
                  <Smile className='h-4 w-4' />
                </Button>

                <Input
                  ref={inputRef}
                  placeholder='Type a message...'
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className='flex-1'
                />

                <Button variant='ghost' size='sm' className='mr-2'>
                  <Mic className='h-4 w-4' />
                </Button>

                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size='sm'
                >
                  <Send className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <MessageCircle className='h-8 w-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                Your Messages
              </h3>
              <p className='text-gray-500'>
                Choose a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
