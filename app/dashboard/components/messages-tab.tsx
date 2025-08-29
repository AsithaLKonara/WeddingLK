'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Loader2, User, Clock } from 'lucide-react';

export default function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/dashboard/user/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className='p-8'>
          <div className='flex items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
            <span className='ml-2'>Loading messages...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-4'>
        <h2 className='flex items-center text-lg font-semibold'>
          <MessageSquare className='h-5 w-5 mr-2' />
          Your Messages
        </h2>
      </div>
      <div>
        {messages.length > 0 ? (
          <div className='space-y-4'>
            {messages.map((message: any) => (
              <div
                key={message._id}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                    <User className='h-5 w-5 text-green-600' />
                  </div>
                  <div>
                    <p className='font-medium'>
                      {message.sender?.name || 'Unknown Sender'}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {message.subject || 'No subject'}
                    </p>
                    <div className='flex items-center space-x-2 text-xs text-gray-400 mt-1'>
                      <Clock className='h-3 w-3' />
                      <span>
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      message.read
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {message.read ? 'Read' : 'New'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8 text-gray-500'>
            <MessageSquare className='h-12 w-12 mx-auto mb-4 text-gray-300' />
            <p>No messages yet</p>
            <p className='text-sm'>
              Communicate with vendors and venues through our messaging system
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
