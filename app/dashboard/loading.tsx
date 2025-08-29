export default function DashboardLoading() {
  return (
    <div className='container mx-auto py-8 px-4 md:px-6'>
      {/* Header div */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center space-x-4'>
          <div className='w-12 h-12 rounded-full' />
          <div>
            <div className='h-8 w-64 mb-2' />
            <div className='h-4 w-48' />
          </div>
        </div>
        <div className='w-10 h-10 rounded' />
      </div>

      {/* Stats div */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {[1, 2, 3, 4].map(i => (
          <div key={i}>
            <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='h-4 w-24' />
              <div className='w-4 h-4 rounded' />
            </div>
            <div>
              <div className='h-8 w-16 mb-2' />
              <div className='h-3 w-32' />
            </div>
          </div>
        ))}
      </div>

      {/* div div */}
      <div className='space-y-6'>
        <div className='flex space-x-2'>
          {['Overview', 'Bookings', 'Favorites', 'Messages', 'Payments'].map(
            tab => (
              <div key={tab} className='h-10 w-20 rounded-md' />
            )
          )}
        </div>

        {/* Content div */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <div>
              <div className='h-6 w-32' />
            </div>
            <div className='space-y-4'>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className='flex items-center space-x-3 p-3 border rounded-lg'
                >
                  <div className='w-10 h-10 rounded-full' />
                  <div className='flex-1'>
                    <div className='h-4 w-32 mb-1' />
                    <div className='h-3 w-24' />
                  </div>
                  <div className='w-16 h-6 rounded' />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div>
              <div className='h-6 w-24' />
            </div>
            <div className='space-y-4'>
              {[1, 2, 3].map(i => (
                <div key={i} className='flex items-center justify-between'>
                  <div>
                    <div className='h-4 w-24 mb-1' />
                    <div className='h-3 w-20' />
                  </div>
                  <div className='w-20 h-8 rounded' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
