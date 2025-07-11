import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-300 dark:text-slate-300 max-w-2xl mx-auto">
            I'm always excited to work on new projects and collaborate with amazing people. Let's create something awesome together!
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 dark:bg-slate-800/50 border-slate-700 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl font-display font-semibold text-white dark:text-white">
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white dark:text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-slate-300 dark:text-slate-300">
                      Thank you for your message. I'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-slate-300 dark:text-slate-300">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        {...form.register('name')}
                        className="form-input mt-1"
                        placeholder="Your full name"
                      />
                      {form.formState.errors.name && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-slate-300 dark:text-slate-300">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register('email')}
                        className="form-input mt-1"
                        placeholder="your@email.com"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="subject" className="text-slate-300 dark:text-slate-300">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        {...form.register('subject')}
                        className="form-input mt-1"
                        placeholder="Project inquiry"
                      />
                      {form.formState.errors.subject && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.subject.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-slate-300 dark:text-slate-300">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        {...form.register('message')}
                        rows={5}
                        className="form-input mt-1 resize-none"
                        placeholder="Tell me about your project..."
                      />
                      {form.formState.errors.message && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.message.message}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {contactMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-display font-semibold mb-6 text-white dark:text-white">
                Let's Connect
              </h3>
              <p className="text-slate-300 dark:text-slate-300 mb-8">
                Whether you have a project in mind, want to collaborate, or just want to say hello, I'd love to hear from you. Here are the best ways to reach me:
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="text-blue-400 h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-white dark:text-white">Email</h4>
                  <p className="text-slate-300 dark:text-slate-300">alex@alexmorgan.dev</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Phone className="text-purple-400 h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-white dark:text-white">Phone</h4>
                  <p className="text-slate-300 dark:text-slate-300">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="text-green-400 h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-white dark:text-white">Location</h4>
                  <p className="text-slate-300 dark:text-slate-300">San Francisco, CA</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-700 dark:border-slate-700">
              <h4 className="font-medium text-white dark:text-white mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <i className="fab fa-github text-slate-300 hover:text-white"></i>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <i className="fab fa-linkedin text-slate-300 hover:text-white"></i>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <i className="fab fa-twitter text-slate-300 hover:text-white"></i>
                </a>
                <a
                  href="mailto:alex@alexmorgan.dev"
                  className="w-12 h-12 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Mail className="text-slate-300 hover:text-white h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
