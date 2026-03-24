import { motion, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Surface } from '@/components/ui/surface';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Spiral } from '@/components/Doodles';
import { portfolioConfig } from '@/portfolio.config';
import { useParallaxMouse } from '@/hooks/use-parallax-mouse';

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message is too short"),
});

type ContactForm = z.infer<typeof contactSchema>;

import ScribbleText from '@/components/ScribbleText';

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mouseX, mouseY } = useParallaxMouse();

  const backX = useTransform(mouseX, [-1, 1], ["5%", "-5%"]);
  const backY = useTransform(mouseY, [-1, 1], ["5%", "-5%"]);

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
        description: "Thank you for reaching out, I will respond as soon as possible.",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again or contact me through social links; " + (error as Error).message,
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
      </motion.div>

      <div className="w-full max-w-2xl relative z-10">
        <Surface variant="elevated" className="p-8 md:p-12 relative">

          <h2 className="text-5xl font-marker text-center mb-8">
            <ScribbleText color="text-highlighter-yellow">say hi</ScribbleText>
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="font-amatic text-2xl font-bold">name</label>
              <Input
                {...form.register('name')}
                variant="sketch"
                placeholder="john doe"
              />
              {form.formState.errors?.name && <p className="text-destructive font-hand">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-amatic text-2xl font-bold">email</label>
              <Input
                {...form.register('email')}
                variant="sketch"
                placeholder="john@example.com"
              />
              {form.formState.errors?.email && <p className="text-destructive font-hand">{form.formState.errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-amatic text-2xl font-bold">message</label>
              <Textarea
                {...form.register('message')}
                variant="sketch"
                placeholder="write something nice..."
              />
              {form.formState.errors?.message && <p className="text-destructive font-hand">{form.formState.errors.message.message}</p>}
            </div>

            <Button
              type="submit"
              variant="paper"
              size="lg"
              disabled={isSubmitting}
              className="w-full text-2xl font-amatic font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "sending..." : "send"}
            </Button>
          </form>
        </Surface>

        <div className="mt-12 text-center font-hand text-lg text-pencil">
          <p>or just find me elsewhere</p>
        </div>
      </div>
    </motion.div>
  );
}
