import Header from '@/components/organisms/header'
import AISearchSection from '@/components/organisms/ai-search-section'
import FeaturesSection from '@/components/organisms/features-section'
import StatsSection from '@/components/organisms/stats-section'
import CTASection from '@/components/organisms/cta-section'
import Footer from '@/components/organisms/footer'

// Simple static components to replace loading ones
function SimpleVendorsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Vendors</h2>
          <p className="text-gray-600">Trusted wedding professionals for your special day</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Perfect Moments Photography", category: "Photography", rating: 4.8 },
            { name: "Elegant Decorators", category: "Decoration", rating: 4.7 },
            { name: "Sweet Dreams Catering", category: "Catering", rating: 4.9 }
          ].map((vendor, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{vendor.name}</h3>
              <p className="text-gray-600 mb-2">{vendor.category}</p>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{vendor.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SimpleVenuesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Venues</h2>
          <p className="text-gray-600">Beautiful locations for your dream wedding</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { name: "Grand Ballroom Hotel", location: "Colombo", capacity: 300, price: "Rs. 50,000" },
            { name: "Garden Paradise", location: "Kandy", capacity: 150, price: "Rs. 35,000" }
          ].map((venue, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-xl mb-2">{venue.name}</h3>
              <p className="text-gray-600 mb-2">{venue.location}</p>
              <p className="text-gray-600 mb-2">Capacity: {venue.capacity} guests</p>
              <p className="text-rose-600 font-semibold">{venue.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SimpleTestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Couples Say</h2>
          <p className="text-gray-600">Real stories from real weddings</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { name: "John & Sarah", comment: "Amazing venue! Perfect for our wedding. The staff was incredibly helpful.", rating: 5 },
            { name: "Mike & Lisa", comment: "Beautiful garden setting. Our guests loved it!", rating: 5 }
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.comment}"</p>
              <p className="font-semibold text-gray-900">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SimplePackagesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Wedding Packages</h2>
          <p className="text-gray-600">Complete wedding solutions tailored for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Basic Package", price: "Rs. 200,000", features: ["Venue booking", "Basic decoration", "Photography"] },
            { name: "Premium Package", price: "Rs. 500,000", features: ["Luxury venue", "Premium decoration", "Professional photography", "Catering"] },
            { name: "Elite Package", price: "Rs. 850,000", features: ["5-star venue", "Designer decoration", "Award-winning photography", "Gourmet catering", "Wedding coordinator"] }
          ].map((pkg, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-xl mb-2">{pkg.name}</h3>
              <p className="text-2xl font-bold text-rose-600 mb-4">{pkg.price}</p>
              <ul className="space-y-2">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <AISearchSection />
        <FeaturesSection />
        <SimplePackagesSection />
        <StatsSection />
        <SimpleVendorsSection />
        <SimpleVenuesSection />
        <SimpleTestimonialsSection />
        <CTASection />
        <Footer />
      </main>
    </>
  )
}
