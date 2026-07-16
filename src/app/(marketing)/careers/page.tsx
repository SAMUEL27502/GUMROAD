"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { careers } from "@/lib/data/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">Careers at TradeBib</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
          Join us in building the future of transparent, automated trading infrastructure.
        </p>
      </motion.div>

      <Card className="glass border-border/60 mb-10">
        <CardContent className="p-8 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-sky-400" />
          <h2 className="mt-4 text-xl font-bold">Why TradeBib?</h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-2xl text-sm">
            Remote-first culture, competitive compensation, equity for early team members, and the
            chance to work on products used by thousands of active traders worldwide.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {careers.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="glass border-border/60 transition-colors hover:border-sky-500/30">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription className="mt-1 flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">{job.department}</Badge>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {job.type}
                    </span>
                  </CardDescription>
                </div>
                <Button onClick={() => toast.success("Application portal opening soon!")}>
                  Apply
                </Button>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="text-muted-foreground mt-10 text-center text-sm">
        Don&apos;t see a fit? Email{" "}
        <a href="mailto:careers@tradebib.com" className="text-sky-400 hover:underline">
          careers@tradebib.com
        </a>{" "}
        with your CV.
      </p>
    </div>
  );
}
