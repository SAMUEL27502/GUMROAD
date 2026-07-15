"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";
import { contactSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    e.currentTarget.reset();
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">Contact Us</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Questions about bots, billing, or MT5 integration? We&apos;re here to help.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4">
          {[
            { icon: Mail, title: "Email", value: "support@tradebib.com" },
            { icon: MessageSquare, title: "Live Chat", value: "Available for Pro & Elite" },
            { icon: User, title: "Response Time", value: "Within 24 hours" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="glass border-border/60">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.title}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card className="glass border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>Fill out the form and our team will respond shortly.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Your name" />
                  {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" />
                  {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="How can we help?" />
                {errors.subject && <p className="text-xs text-red-400">{errors.subject}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us more..."
                  className="flex w-full rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {errors.message && <p className="text-xs text-red-400">{errors.message}</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                <Send className="h-4 w-4" />
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
