'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  MapPin,
  Calendar,
  Users,
  Share,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface FeedPost {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    location?: string;
  };
  content: string;
  images: string[];
  location?: string;
  date: Date;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  type: 'wedding' | 'engagement' | 'planning' | 'inspiration';
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

export default function InstagramFeed() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call with shorter delay for testing
        await new Promise(resolve => setTimeout(resolve, 100));
        const mockPosts: FeedPost[] = [
          {
            id: '1',
            user: {
              id: 'user1',
              name: 'Sarah & Mike',
              avatar: '/avatars/couple1.jpg',
              verified: true,
              location: 'Colombo, Sri Lanka',
            },
            content:
              "Just booked our dream wedding venue! Can't wait for our special day. The planning journey begins! 💍✨",
            images: ['/venues/venue1.jpg'],
            location: 'Grand Ballroom Hotel, Colombo',
            date: new Date('2025-08-23'),
            likes: 124,
            comments: 18,
            shares: 5,
            isLiked: false,
            isBookmarked: false,
            tags: ['wedding', 'planning', 'venue', 'love'],
            type: 'wedding',
          },
          {
            id: '2',
            user: {
              id: 'user2',
              name: 'Priya & David',
              avatar: '/avatars/couple2.jpg',
              verified: true,
              location: 'Kandy, Sri Lanka',
            },
            content:
              'Engagement photoshoot at the beautiful Temple of the Tooth! Our photographer captured the perfect moments. 📸💕',
            images: ['/venues/venue2.jpg'],
            location: 'Temple of the Tooth, Kandy',
            date: new Date('2025-08-20'),
            likes: 89,
            comments: 12,
            shares: 3,
            isLiked: true,
            isBookmarked: true,
            tags: ['engagement', 'photography', 'kandy', 'temple'],
            type: 'engagement',
          },
          {
            id: '3',
            user: {
              id: 'user3',
              name: 'Emma & James',
              avatar: '/avatars/couple3.jpg',
              verified: false,
              location: 'Galle, Sri Lanka',
            },
            content:
              'Wedding planning checklist is almost complete! Only 3 months to go. The excitement is real! 🎉',
            images: ['/venues/venue3.jpg'],
            location: 'Galle Fort, Galle',
            date: new Date('2025-08-18'),
            likes: 67,
            comments: 8,
            shares: 2,
            isLiked: false,
            isBookmarked: false,
            tags: ['planning', 'checklist', 'galle', 'countdown'],
            type: 'planning',
          },
        ];
        setPosts(mockPosts);
      } catch (err) {
        setError('Failed to fetch posts.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return;

    // TODO: Implement real comment submission
    toast({
      title: 'Comment posted',
      description: 'Your comment has been added successfully.',
    });

    setCommentText('');
  };

  const handleShare = (postId: string) => {
    // TODO: Implement real sharing functionality
    toast({
      title: 'Post shared',
      description: 'Post has been shared successfully.',
    });
  };

  const handleBookmark = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  if (isLoading) {
    return (
      <div className='max-w-2xl mx-auto space-y-6'>
        <div className='text-center py-8'>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-2xl mx-auto space-y-6'>
        <div className='text-center py-8'>
          <p className='text-destructive'>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className='max-w-2xl mx-auto space-y-6'>
        <div className='text-center py-8'>
          <p>No posts found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      {posts.map(post => (
        <article
          key={post.id}
          className='rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden'
        >
          <CardHeader className='flex flex-col space-y-1.5 p-6 pb-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>
                    {post.user.name
                      .split(' ')
                      .map(n => n[0])
                      .join('&')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='flex items-center space-x-2'>
                    <span className='font-semibold text-sm'>
                      {post.user.name}
                    </span>
                    {post.user.verified && (
                      <Badge variant='secondary' className='text-xs'>
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <div className='flex items-center space-x-2 text-xs text-gray-500'>
                    {post.location && (
                      <>
                        <MapPin className='h-3 w-3' />
                        <span>{post.location}</span>
                      </>
                    )}
                    <Calendar className='h-3 w-3' />
                    <span>{post.date.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Button variant='ghost' size='sm'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </div>
          </CardHeader>

          {post.images.length > 0 && (
            <div className='relative'>
              <Image
                src={post.images[0]}
                alt='Post image'
                width={600}
                height={400}
                className='w-full h-auto'
              />
            </div>
          )}

          <CardContent className='pt-4'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center space-x-4'>
                <button
                  onClick={() => handleLike(post.id)}
                  className='flex items-center space-x-2 hover:text-red-500 transition-colors'
                  aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
                  aria-pressed={post.isLiked}
                >
                  <Heart
                    className={`h-6 w-6 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  <span>{post.likes.toLocaleString()}</span>
                </button>

                <button
                  onClick={() =>
                    setShowComments(showComments === post.id ? null : post.id)
                  }
                  className='flex items-center space-x-2 hover:text-blue-500 transition-colors'
                  aria-label='Show comments'
                  aria-expanded={showComments === post.id}
                  aria-controls={`comments-${post.id}`}
                >
                  <MessageCircle className='h-6 w-6' />
                  <span>{post.comments}</span>
                </button>

                <button
                  onClick={() => handleShare(post.id)}
                  className='flex items-center space-x-2 hover:text-green-500 transition-colors'
                  aria-label='Share post'
                >
                  <Share2 className='h-6 w-6' />
                  <span>{post.shares}</span>
                </button>
              </div>

              <button
                onClick={() => handleBookmark(post.id)}
                className='hover:text-yellow-500 transition-colors'
                aria-label={
                  post.isBookmarked
                    ? 'Remove from bookmarks'
                    : 'Add to bookmarks'
                }
                aria-pressed={post.isBookmarked}
              >
                <Bookmark
                  className={`h-6 w-6 ${post.isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`}
                />
              </button>
            </div>

            <div className='mb-3'>
              <div className='flex items-center space-x-2 mb-2'>
                <Badge variant='secondary' className='text-xs capitalize'>
                  {post.type}
                </Badge>
                <span className='font-semibold text-sm'>{post.user.name}</span>
              </div>
              <span className='text-sm'>{post.content}</span>
            </div>

            {post.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-3'>
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className='text-xs text-blue-600 hover:underline cursor-pointer'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {post.comments > 0 && (
              <div className='mb-3'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() =>
                    setShowComments(showComments === post.id ? null : post.id)
                  }
                  className='text-gray-500 text-sm p-0 h-auto'
                >
                  View all {post.comments} comments
                </Button>
              </div>
            )}

            {/* Single Comment Input */}
            <div className='flex items-center space-x-2'>
              <Input
                placeholder='Add a comment...'
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className='flex-1'
                onKeyPress={e => e.key === 'Enter' && handleComment(post.id)}
              />
              <Button
                size='sm'
                onClick={() => handleComment(post.id)}
                disabled={!commentText.trim()}
              >
                <Send className='h-4 w-4' />
              </Button>
            </div>

            {/* Comments Section */}
            {showComments === post.id && (
              <div id={`comments-${post.id}`} className='mt-4 pt-4 border-t'>
                <div className='space-y-3'>
                  {/* TODO: Fetch and display real comments */}
                  <div className='flex items-start space-x-3'>
                    <Avatar className='h-6 w-6'>
                      <AvatarImage src='/avatars/user1.jpg' />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <div className='bg-gray-50 rounded-lg p-3'>
                        <span className='font-semibold text-sm mr-2'>
                          User Name
                        </span>
                        <span className='text-sm'>
                          Beautiful wedding! Congratulations! 🎉
                        </span>
                      </div>
                      <div className='flex items-center space-x-4 mt-2 text-xs text-gray-500'>
                        <span>2h ago</span>
                        <button className='hover:text-gray-700'>Like</button>
                        <button className='hover:text-gray-700'>Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </article>
      ))}
    </div>
  );
}
