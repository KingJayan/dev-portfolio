import { motion, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Star, Spiral, Arrow } from '@/components/Doodles';
import { portfolioConfig } from '@/portfolio.config';
import { useSmoothDamp2D } from '@/hooks/use-smooth-damp';

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message is too short"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);


  // mouse parallax target
  const [target, setTarget] = useState({ x: 0, y: 0 });

  // Smooth-damp motion
  const { x: mouseX, y: mouseY } = useSmoothDamp2D(target, 0.2);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (event.clientX / innerWidth) * 2 - 1;
      const ny = (event.clientY / innerHeight) * 2 - 1;
      setTarget({ x: nx, y: ny });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // layers
  const backX = useTransform(mouseX, [-1, 1], ["5%", "-5%"]);
  const backY = useTransform(mouseY, [-1, 1], ["5%", "-5%"]);
  const cardX = useTransform(mouseX, [-1, 1], ["-2%", "2%"]);
  const cardY = useTransform(mouseY, [-1, 1], ["-2%", "2%"]);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out! I'll get back to you soon.",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again or use social media!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden flex items-center justify-center"
    >

      {/* bg doodles layer */}
      <motion.div style={{ x: backX, y: backY }} className="absolute inset-0 pointer-events-none opacity-40">
        <Spiral className="absolute top-20 left-10 w-32 h-32 text-pencil/30" />
        <Star className="absolute bottom-40 right-20 w-16 h-16 text-highlighter-yellow/50" />
        <Arrow className="absolute top-1/2 left-20 w-48 h-24 text-ink/20 rotate-12" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-highlighter-pink/40" />
      </motion.div>

      {/* main card layer */}
      <motion.div style={{ x: cardX, y: cardY }} className="w-full max-w-2xl relative z-10">
        <div className="paper-card p-8 md:p-12 rotate-1 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/50 rotate-[-1deg] backdrop-blur-sm border-l border-r border-white/20 shadow-sm" />

          <h2 className="text-5xl font-marker text-center mb-8">Say Hello!</h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="font-amatic text-2xl font-bold">Your Name</label>
              <Input
                {...form.register('name')}
                className="bg-transparent border-b-2 border-pencil border-t-0 border-x-0 rounded-none px-0 focus:border-ink shadow-none font-hand text-xl focus:ring-0"
                placeholder="John Doe"
              />
              {form.formState.errors?.name && <p className="text-destructive font-hand">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-amatic text-2xl font-bold">Your Email</label>
              <Input
                {...form.register('email')}
                className="bg-transparent border-b-2 border-pencil border-t-0 border-x-0 rounded-none px-0 focus:border-ink shadow-none font-hand text-xl focus:ring-0"
                placeholder="john@example.com"
              />
              {form.formState.errors?.email && <p className="text-destructive font-hand">{form.formState.errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-amatic text-2xl font-bold">Message</label>
              <Textarea
                {...form.register('message')}
                className="bg-paper-pattern border-2 border-pencil rounded-lg p-4 font-hand text-xl focus:border-ink shadow-inner min-h-[150px]"
                placeholder="Write something nice..."
              />
              {form.formState.errors?.message && <p className="text-destructive font-hand">{form.formState.errors.message.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-2xl font-amatic font-bold bg-ink text-paper hover:bg-pencil hover:scale-[1.02] transition-all shadow-paper hover:shadow-paper-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        <div className="mt-12 text-center font-hand text-pencil">
          <p>Or find me on social media!</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
