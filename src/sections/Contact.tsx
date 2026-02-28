import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
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

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message is too short"),
});

type ContactForm = z.infer<typeof contactSchema>;

import ScribbleText from '@/components/ScribbleText';

const springConfig = { stiffness: 50, damping: 30, mass: 1 };

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, springConfig);
  const mouseY = useSpring(rawY, springConfig);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      rawX.set((event.clientX / innerWidth) * 2 - 1);
      rawY.set((event.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
        title: "Message Sent",
        description: "Thank you for reaching out. I will respond as soon as possible.",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again or contact me through social links.",
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

      {/*doodles bg*/}
      <motion.div style={{ x: backX, y: backY }} className="absolute inset-0 pointer-events-none opacity-40">
        <Spiral className="absolute top-20 left-10 w-32 h-32 text-pencil/30" />
        <Star className="absolute bottom-40 right-20 w-16 h-16 text-highlighter-yellow" />
        <Arrow className="absolute top-1/2 left-20 w-48 h-24 text-ink/20 rotate-12" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-highlighter-pink" />
      </motion.div>

      <motion.div style={{ x: cardX, y: cardY }} className="w-full max-w-2xl relative z-10">
        <div className="paper-card p-8 md:p-12 relative">

          <h2 className="text-5xl font-marker text-center mb-8">
            <ScribbleText color="text-highlighter-yellow">Say Hello!</ScribbleText>
          </h2>

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
