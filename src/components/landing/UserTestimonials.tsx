
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Alex Chen',
    role: 'Digital Artist',
    avatar: '/placeholder.svg',
    rating: 5,
    content: 'Cardshow has revolutionized how I showcase my digital art. The 3D card viewer brings my creations to life like never before.',
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    role: 'Collector',
    avatar: '/placeholder.svg',
    rating: 5,
    content: 'The trading system is incredibly smooth, and I love how I can organize my collections with beautiful galleries.',
  },
  {
    id: '3',
    name: 'Jake Thompson',
    role: 'Content Creator',
    avatar: '/placeholder.svg',
    rating: 5,
    content: 'The monetization tools are fantastic. I\'ve been able to turn my passion for card design into a sustainable income.',
  },
];

const UserTestimonials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="p-6 bg-[#1a1a1a] border-gray-700">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-white">{testimonial.name}</h4>
              <p className="text-sm text-gray-400">{testimonial.role}</p>
            </div>
          </div>
          
          <div className="flex space-x-1 mb-3">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            "{testimonial.content}"
          </p>
        </Card>
      ))}
    </div>
  );
};

export default UserTestimonials;
