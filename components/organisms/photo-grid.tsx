'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Share2,
  Download,
  Eye,
  Calendar,
  MapPin,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Photo {
  _id: string;
  _url: string;
  _title: string;
  _category: string;
  _venue: string;
  _venueId: string;
  _photographer: string;
  _photographerAvatar: string;
  _date: string;
  _likes: number;
  _views: number;
  _isLiked: boolean;
  _tags: string[];
  _description: string;
}

interface PhotoGridProps {
  _category: string;
  _venue: string;
}

// Mock data for photos (fallback)
const mockPhotos: Photo[] = [
  {
    _id: '1',
    _url: '/placeholder.svg?height=400&width=300',
    _title: 'Traditional Kandyan Wedding Ceremony',
    _category: 'ceremonies',
    _venue: 'cinnamon-grand',
    _venueId: 'cinnamon-grand',
    _photographer: 'Amara Photography',
    _photographerAvatar: '/placeholder.svg?height=40&width=40',
    _date: '2024-01-15',
    _likes: 234,
    _views: 1250,
    _isLiked: false,
    _tags: ['traditional', 'kandyan', 'ceremony'],
    _description:
      'Beautiful traditional Kandyan wedding ceremony with authentic cultural elements',
  },
  {
    _id: '2',
    _url: '/placeholder.svg?height=500&width=400',
    _title: 'Modern Reception Decoration',
    _category: 'decorations',
    _venue: 'shangri-la',
    _venueId: 'shangri-la',
    _photographer: 'Lens & Light Studio',
    _photographerAvatar: '/placeholder.svg?height=40&width=40',
    _date: '2024-01-20',
    _likes: 189,
    _views: 890,
    _isLiked: true,
    _tags: ['modern', 'reception', 'decoration'],
    description:
      'Elegant modern reception setup with contemporary floral arrangements',
  },
  {
    _id: '3',
    _url: '/placeholder.svg?height=600&width=400',
    _title: 'Couple Portrait Session',
    _category: 'couples',
    _venue: 'galle-face',
    _venueId: 'galle-face',
    _photographer: 'Moments by Malith',
    _photographerAvatar: '/placeholder.svg?height=40&width=40',
    _date: '2024-02-01',
    _likes: 156,
    _views: 670,
    _isLiked: false,
    _tags: ['couples', 'portrait', 'romantic'],
    description:
      'Romantic couple portrait session at sunset with ocean backdrop',
  },
  {
    _id: '4',
    _url: '/placeholder.svg?height=400&width=350',
    _title: 'Venue Architecture',
    _category: 'venues',
    _venue: 'kingsbury',
    _venueId: 'kingsbury',
    _photographer: 'Architecture Focus',
    _photographerAvatar: '/placeholder.svg?height=40&width=40',
    _date: '2024-02-05',
    _likes: 98,
    _views: 445,
    _isLiked: false,
    _tags: ['venue', 'architecture', 'interior'],
    description:
      'Stunning venue architecture showcasing elegant interior design',
  },
  {
    _id: '5',
    _url: '/placeholder.svg?height=450&width=300',
    _title: 'Traditional Dance Performance',
    _category: 'traditional',
    _venue: 'heritance-kandalama',
    _venueId: 'heritance-kandalama',
    _photographer: 'Cultural Captures',
    _photographerAvatar: '/placeholder.svg?height=40&width=40',
    _date: '2024-02-10',
    _likes: 267,
    _views: 1100,
    _isLiked: true,
    _tags: ['traditional', 'dance', 'cultural'],
    description:
      'Captivating traditional dance performance during wedding ceremony',
  },
  {
    _id: '6',
    _url: '/placeholder.svg?height=550&width=400',
    _title: 'Reception Celebration',
    _category: 'receptions',
    _venue: 'taj-samudra',
    _venueId: 'taj-samudra',
    _photographer: 'Celebration Studios',
    _photographerAvatar: '/placeholder.svg?height=40&width=40',
    _date: '2024-02-15',
    _likes: 312,
    _views: 1450,
    _isLiked: false,
    _tags: ['reception', 'celebration', 'party'],
    _description: 'Joyful reception celebration with family and friends',
  },
];

export function PhotoGrid({ category, venue }: PhotoGridProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch photos from API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/photos');
        if (response.ok) {
          const data = await response.json();
          setPhotos(data.photos || []);
        } else {
          console.error('Failed to fetch photos');
          // Fallback to mock data
          setPhotos(mockPhotos);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
        // Fallback to mock data
        setPhotos(mockPhotos);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Filter photos based on category and venue
  const filteredPhotos = photos.filter(photo => {
    const categoryMatch = category === 'all' || photo._category === category;
    const venueMatch = venue === 'all' || photo._venue === venue;
    return categoryMatch && venueMatch;
  });

  const toggleLike = (_photoId: string) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.__id === _photoId
          ? {
              ...photo,
              _isLiked: !photo.__isLiked,
              _likes: photo.__isLiked ? photo.__likes - 1 : photo.__likes + 1,
            }
          : photo
      )
    );
  };

  const openPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    // Increment view count
    setPhotos(prev =>
      prev.map(p => (p._id === photo.__id ? { ...p, _views: p._views + 1 } : p))
    );
  };

  return (
    <>
      <div className='space-y-6'>
        {/* Results Count */}
        <div className='flex items-center justify-between'>
          <p className='text-gray-600'>
            Showing {filteredPhotos.length} photos
            {category !== 'all' && ` in ${category}`}
            {venue !== 'all' && ` from selected venue`}
          </p>
        </div>

        {/* Photo Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          <AnimatePresence>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.__id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className='group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300'
              >
                {/* Photo */}
                <div
                  className='relative aspect-[3/4] overflow-hidden cursor-pointer'
                  onClick={() => openPhoto(photo)}
                >
                  <img
                    src={photo._url || '/placeholder.svg'}
                    alt={photo._title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                  />

                  {/* Overlay */}
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300' />

                  {/* View Count */}
                  <div className='absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1'>
                    <Eye className='h-3 w-3' />
                    {photo._views}
                  </div>

                  {/* Category Badge */}
                  <div className='absolute top-3 left-3'>
                    <Badge
                      variant='secondary'
                      className='bg-white/90 text-gray-800'
                    >
                      {photo._category}
                    </Badge>
                  </div>
                </div>

                {/* Photo Info */}
                <div className='p-4'>
                  <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2'>
                    {photo._title}
                  </h3>

                  <div className='flex items-center gap-2 text-sm text-gray-600 mb-3'>
                    <Avatar className='h-6 w-6'>
                      <AvatarImage
                        src={photo._photographerAvatar || '/placeholder.svg'}
                      />
                      <AvatarFallback>{photo._photographer[0]}</AvatarFallback>
                    </Avatar>
                    <span>{photo._photographer}</span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <button
                        onClick={() => toggleLike(photo._id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          photo._isLiked
                            ? 'text-rose-500'
                            : 'text-gray-500 hover:text-rose-500'
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${photo._isLiked ? 'fill-current' : ''}`}
                        />
                        {photo._likes}
                      </button>

                      <button className='flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700'>
                        <Share2 className='h-4 w-4' />
                      </button>
                    </div>

                    <span className='text-xs text-gray-500'>
                      {new Date(photo._date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <Eye className='h-12 w-12 mx-auto' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              No photos found
            </h3>
            <p className='text-gray-600'>
              Try adjusting your filters to see more photos
            </p>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      <Dialog
        open={!!selectedPhoto}
        onOpenChange={() => setSelectedPhoto(null)}
      >
        <DialogContent className='max-w-4xl w-full p-0'>
          {selectedPhoto && (
            <div className='flex flex-col lg:flex-row'>
              {/* Photo */}
              <div className='flex-1 relative'>
                <img
                  src={selectedPhoto._url || '/placeholder.svg'}
                  alt={selectedPhoto._title}
                  className='w-full h-[60vh] lg:h-[80vh] object-cover'
                />
              </div>

              {/* Photo Details */}
              <div className='w-full lg:w-80 p-6 space-y-4'>
                <div className='flex items-start justify-between'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    {selectedPhoto._title}
                  </h2>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSelectedPhoto(null)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>

                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarImage
                      src={
                        selectedPhoto._photographerAvatar || '/placeholder.svg'
                      }
                    />
                    <AvatarFallback>
                      {selectedPhoto._photographer[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>{selectedPhoto._photographer}</p>
                    <p className='text-sm text-gray-600'>Photographer</p>
                  </div>
                </div>

                <p className='text-gray-700'>{selectedPhoto._description}</p>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <MapPin className='h-4 w-4' />
                    <span>Venue: {selectedPhoto._venue}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Calendar className='h-4 w-4' />
                    <span>
                      {new Date(selectedPhoto._date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Eye className='h-4 w-4' />
                    <span>{selectedPhoto._views} views</span>
                  </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                  {selectedPhoto.__tags.map(tag => (
                    <Badge key={tag} variant='outline'>
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className='flex items-center gap-2 pt-4 border-t'>
                  <Button
                    variant={selectedPhoto._isLiked ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => toggleLike(selectedPhoto._id)}
                    className='flex-1'
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${selectedPhoto._isLiked ? 'fill-current' : ''}`}
                    />
                    {selectedPhoto._likes}
                  </Button>
                  <Button variant='outline' size='sm'>
                    <Share2 className='h-4 w-4' />
                  </Button>
                  <Button variant='outline' size='sm'>
                    <Download className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PhotoGrid;
