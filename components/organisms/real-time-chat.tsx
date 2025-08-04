"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  File, 
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  Filter
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file'
  isRead: boolean
  attachments?: {
    type: 'image' | 'file'
    url: string
    name: string
    size?: number
  }[]
}

interface ChatContact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
  status: 'online' | 'offline' | 'away'
}

interface RealTimeChatProps {
  currentUserId: string
  contacts: ChatContact[]
  onSendMessage?: (message: Omit<Message, 'id' | 'timestamp'>) => void
}

export function RealTimeChat({ currentUserId, contacts, onSendMessage }: RealTimeChatProps) {
  const { toast } = useToast()
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'unread'>('all')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock messages for demo
  useEffect(() => {
    if (selectedContact) {
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: selectedContact.id,
          senderName: selectedContact.name,
          senderAvatar: selectedContact.avatar,
          content: 'Hi! I saw your wedding venue listing. It looks perfect for our special day!',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text',
          isRead: true
        },
        {
          id: '2',
          senderId: currentUserId,
          senderName: 'You',
          senderAvatar: '/placeholder-user.jpg',
          content: 'Thank you! Yes, it\'s a beautiful venue. When is your wedding date?',
          timestamp: new Date(Date.now() - 3000000),
          type: 'text',
          isRead: true
        },
        {
          id: '3',
          senderId: selectedContact.id,
          senderName: selectedContact.name,
          senderAvatar: selectedContact.avatar,
          content: 'We\'re planning for June 15th, 2024. Do you have availability?',
          timestamp: new Date(Date.now() - 2400000),
          type: 'text',
          isRead: true
        },
        {
          id: '4',
          senderId: currentUserId,
          senderName: 'You',
          senderAvatar: '/placeholder-user.jpg',
          content: 'Let me check our calendar for you.',
          timestamp: new Date(Date.now() - 1800000),
          type: 'text',
          isRead: false
        }
      ]
      setMessages(mockMessages)
    }
  }, [selectedContact, currentUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    const message: Omit<Message, 'id' | 'timestamp'> = {
      senderId: currentUserId,
      senderName: 'You',
      senderAvatar: '/placeholder-user.jpg',
      content: newMessage.trim(),
      type: 'text',
      isRead: false
    }

    setMessages(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }])

    setNewMessage("")
    onSendMessage?.(message)

    toast({
      title: "Message sent",
      description: "Your message has been delivered",
      variant: "default"
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const message: Omit<Message, 'id' | 'timestamp'> = {
      senderId: currentUserId,
      senderName: 'You',
      senderAvatar: '/placeholder-user.jpg',
      content: `Sent ${file.name}`,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      isRead: false,
      attachments: [{
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }]
    }

    setMessages(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }])

    toast({
      title: "File uploaded",
      description: `${file.name} has been sent`,
      variant: "default"
    })
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'online' && contact.isOnline) ||
      (filterStatus === 'unread' && contact.unreadCount > 0)
    return matchesSearch && matchesFilter
  })

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Contacts List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Messages</span>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </CardTitle>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-1">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'online' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('online')}
              >
                Online
              </Button>
              <Button
                variant={filterStatus === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('unread')}
              >
                Unread
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="space-y-1">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{contact.name}</p>
                      <span className="text-xs text-gray-500">
                        {formatTime(contact.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                  </div>
                  {contact.unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                      {contact.unreadCount}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2 flex flex-col">
        {selectedContact ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedContact.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${
                        selectedContact.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm text-gray-500">
                        {selectedContact.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.senderId === currentUserId ? 'order-2' : 'order-1'}`}>
                        {message.senderId !== currentUserId && (
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                              <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">{message.senderName}</span>
                          </div>
                        )}
                        <div className={`rounded-lg p-3 ${
                          message.senderId === currentUserId
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          {message.attachments && message.attachments.length > 0 ? (
                            <div className="space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="space-y-1">
                                  {attachment.type === 'image' ? (
                                    <img
                                      src={attachment.url}
                                      alt={attachment.name}
                                      className="max-w-full rounded"
                                    />
                                  ) : (
                                    <div className="flex items-center space-x-2 p-2 bg-gray-200 dark:bg-gray-700 rounded">
                                      <File className="h-4 w-4" />
                                      <div>
                                        <p className="text-sm font-medium">{attachment.name}</p>
                                        {attachment.size && (
                                          <p className="text-xs text-gray-500">
                                            {formatFileSize(attachment.size)}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                              <p className="text-sm">{message.content}</p>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 ${
                          message.senderId === currentUserId ? 'text-right' : 'text-left'
                        }`}>
                          {formatTime(message.timestamp)}
                          {message.senderId === currentUserId && (
                            <span className="ml-2">
                              {message.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            <div className="border-t p-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Select a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a contact to start messaging
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default RealTimeChat 