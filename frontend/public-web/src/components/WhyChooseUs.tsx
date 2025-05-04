import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Predict Your Energy Costs",
    description: "With solar, you'll know exactly how much energy you'll be using for the next 25 years. Predictable energy prices equate to a more stable spending plan.",
    icon: (
      <svg className="w-16 h-16 text-green-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.92c0 4.54-2.99 8.79-7 10.02-4.01-1.23-7-5.48-7-10.02V6.3l7-3.12z" />
        <path d="M12 6l-6 6h4v4h4v-4h4z" />
      </svg>
    ),
  },
  {
    title: "Reduced Carbon Footprint",
    description: "Solar energy is free, clean, and renewable. Solar energy, in contrast to fossil fuels, does not produce damaging greenhouse gas emissions.",
    icon: (
      <svg className="w-16 h-16 text-green-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8h3v12h-3zM4 5h3v15H4zM11 2h3v18h-3z" />
      </svg>
    ),
  },
  {
    title: "Flexible Financing Options",
    description: "There are a number of flexible financing options available for commercial businesses, including options that require little up-front costs.",
    icon: (
      <svg className="w-16 h-16 text-green-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </svg>
    ),
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why <span className="text-green-500">Choose Us</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our customer-focused philosophy drives us to prioritize your satisfaction, ensuring
            that your vision becomes our mission.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gray-50"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
