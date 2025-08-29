'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2, MapPin, Star } from 'lucide-react';

export default function FavoritesTab() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/dashboard/user/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
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
            <span className='ml-2'>Loading favorites...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-4'>
        <h2 className='flex items-center text-lg font-semibold'>
          <Heart className='h-5 w-5 mr-2' />
          Your Favorites
        </h2>
      </div>
      <div>
        {favorites.length > 0 ? (
          <div className='space-y-4'>
            {favorites.map((favorite: any) => (
              <div
                key={favorite._id}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center'>
                    <Heart className='h-5 w-5 text-pink-600' />
                  </div>
                  <div>
                    <p className='font-medium'>
                      {favorite.name || 'Favorite Item'}
                    </p>
                    <div className='flex items-center space-x-2 text-sm text-gray-500'>
                      <MapPin className='h-3 w-3' />
                      <span>
                        {favorite.location || 'Location not specified'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='flex items-center space-x-1'>
                    <Star className='h-4 w-4 text-yellow-500 fill-current' />
                    <span className='text-sm'>{favorite.rating || 'N/A'}</span>
                  </div>
                  <span className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium mt-1'>
                    {favorite.type || 'Item'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8 text-gray-500'>
            <Heart className='h-12 w-12 mx-auto mb-4 text-gray-300' />
            <p>No favorites yet</p>
            <p className='text-sm'>
              Save your favorite venues and vendors for easy access
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
