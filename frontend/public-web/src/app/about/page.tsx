import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="text-center py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Find Out More <span className="text-green-500">About Us</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          Discover the journey that led us to become a trusted name in the solar industry,
          driven by our passion for sustainable energy solutions.
        </p>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative w-full h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200"
              alt="Solar Panel Installation"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              We are dedicated to delivering innovative, reliable, and economically viable renewable energy solutions to power Sri Lanka's progress.
            </h2>

            <div className="space-y-4 text-gray-600">
              <p>
                We are a pioneering force in Sri Lanka's renewable energy sector, dedicated to
                transforming the way our nation renewable energy power. With a deep-rooted
                commitment to sustainability and innovation, our company stands as a beacon of
                excellence in the field of solar energy. Our exceptional team stands as a testament to
                our commitment to excellence and quality in every facet of our operations. We take
                immense pride in our highly qualified and experienced staff, who are proficient,
                innovation, and dedication to the table.
              </p>

              <p>
                Determined and unwavering, we've moved ahead steadily, achieving incredible
                milestones all along. We're truly proud of our consistent record of overcoming
                challenges and turning them into achievements. Right from the beginning, we've
                shown our skills by successfully completing many commercial and residential
                projects. This journey of excellence has led us to an impressive milestone - we now
                have a total project capacity of over 6MW today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
