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
        <Surface variant="elevated" className="p-8 md:p-12 relative border-rose/20">

          <h2 className="text-5xl font-marker text-center mb-8">
            <ScribbleText color="text-highlighter-yellow">say hi</ScribbleText>
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="font-hand text-base text-pencil/80">name</label>
              <Input
                {...form.register('name')}
                variant="sketch"
                placeholder="john doe"
              />
              {form.formState.errors?.name && <p className="text-destructive font-hand">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-hand text-base text-pencil/80">email</label>
              <Input
                {...form.register('email')}
                variant="sketch"
                placeholder="john@example.com"
              />
              {form.formState.errors?.email && <p className="text-destructive font-hand">{form.formState.errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="font-hand text-base text-pencil/80">message</label>
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
              className="w-full font-hand text-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "sending..." : "send"}
            </Button>
          </form>
        </Surface>

        <div className="mt-12 text-center font-hand text-lg text-pencil">
          <p>or just find me elsewhere</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            {portfolioConfig.social.github && (
              <a href={portfolioConfig.social.github} target="_blank" rel="noreferrer" aria-label="github" className="text-pencil/60 hover:text-ink transition-colors">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
            )}
            {portfolioConfig.social.linkedin && (
              <a href={portfolioConfig.social.linkedin} target="_blank" rel="noreferrer" aria-label="linkedin" className="text-pencil/60 hover:text-ink transition-colors">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            )}
            {portfolioConfig.social.twitter && (
              <a href={portfolioConfig.social.twitter} target="_blank" rel="noreferrer" aria-label="twitter" className="text-pencil/60 hover:text-ink transition-colors">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
