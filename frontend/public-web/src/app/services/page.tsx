import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const services = [
  {
    title: "Domestic Solutions",
    description: "This category offers includes solar PV systems installed on homes where energy bills are calculated using the CEB/LECO residential tariff.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200"
  },
  {
    title: "Industrial Solutions",
    description: "This category primarily includes solar PV systems installed on commercial buildings whose energy bills are computed by CEB/LECO using General Purpose, Industrial Purpose, Hotel, and Government tariff rates.",
    image: "https://images.unsplash.com/photo-1605980413988-9ff24c537935?q=80&w=1200"
  },
  {
    title: "Utility Solutions",
    description: "The Ceylon Electricity Board has a separate Power Purchase Agreements with these solutions. The typical capacity of a solar PV system is more than one megawatt.",
    image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=1200"
  },
  {
    title: "Maintaince",
    description: "Our experienced staff can guarantee your solar PV system is constantly performing at its optimum.",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1200"
  }
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <p className="text-green-500 font-medium uppercase tracking-wide mb-2">
          SERVICES
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Check Our <span className="text-green-500">Services</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore a comprehensive suite of services that cover all aspects of your
          requirements, providing a one-stop solution.
        </p>
      </div>

      {/* Services Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="relative h-64 w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority={index < 2}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm text-center">
                    {service.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
