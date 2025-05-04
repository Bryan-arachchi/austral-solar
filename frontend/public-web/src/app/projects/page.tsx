'use client';

import Image from 'next/image';

const projects = [
  { id: 1, image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80', size: 'medium' },
  { id: 2, image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80', size: 'medium' },
  { id: 3, image: 'https://images.unsplash.com/photo-1566093097221-ac2335b09e70?auto=format&fit=crop&q=80', size: 'medium' },
  { id: 4, image: 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80', size: 'medium' },
  { id: 5, image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80', size: 'medium' },
  { id: 6, image: 'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&q=80', size: 'medium' },
  { id: 7, image: 'https://images.unsplash.com/photo-1595437193398-f24279553f4f?auto=format&fit=crop&q=80', size: 'medium' },
  { id: 8, image: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?auto=format&fit=crop&q=80', size: 'medium' },
  { id: 9, image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80', size: 'medium' },
  { id: 10, image: 'https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&q=80', size: 'medium' }
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header Section */}
      <div className="text-center py-16">

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Check Our <span className="text-green-500">Projects</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          Browse through our project showcase to get a glimpse of the diverse range of
          industries we've worked with and the solutions we've provided.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`relative group cursor-pointer overflow-hidden rounded-lg
                ${project.size === 'large' ? 'col-span-2 row-span-2' :
                  project.size === 'medium' ? 'col-span-1 row-span-2' :
                    'col-span-1 row-span-1'}
              `}
            >
              <div className={`
                relative w-full
                ${project.size === 'large' ? 'h-[400px]' :
                  project.size === 'medium' ? 'h-[300px]' :
                    'h-[200px]'}
              `}>
                <Image
                  src={project.image}
                  alt={`Project ${project.id}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes={
                    project.size === 'large' ? '(max-width: 768px) 100vw, 50vw' :
                      project.size === 'medium' ? '(max-width: 768px) 50vw, 33vw' :
                        '(max-width: 768px) 50vw, 25vw'
                  }
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
