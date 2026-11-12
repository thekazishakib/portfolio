import React from "react";
import {
  Trophy,
  BriefcaseBusiness as Briefcase,
  GraduationCap,
  TrendingUp,
  Mail,
  Linkedin,
  Github,
  NotebookText as BookOpen,
  Award,
  Globe,
  Facebook,
  Instagram,
  SquareCode as Code,
  Star,
  FileUser as FileText,
  SquareArrowOutUpRight as ExternalLink,
  Medal,
  Crown,

  ShieldCheck
} from "lucide-react";

export const ICON_OPTIONS = [
  "Award",
  "Medal",
  "Trophy",
  "Star",
  "Crown",
  "GraduationCap",
  "TrendingUp",
  "Briefcase",
  "Mail",
  "Linkedin",
  "Github",
  "BookOpen",
  "Globe",
  "Facebook",
  "Instagram",
  "Code",
  "FileText",
  "ShieldCheck",
  "ExternalLink"
] as const;

export function DynamicIcon({
  name,
  className = "w-4 h-4"
}: {
  name: string;
  className?: string;
}) {
  switch (name) {
    case "Award":
      return <Award className={className} />;
    case "Medal":
      return <Medal className={className} />;
    case "Trophy":
      return <Trophy className={className} />;
    case "Star":
      return <Star className={className} />;
    case "Crown":
      return <Crown className={className} />;
    case "Sparkles":
      return <Star className={className} />;
    case "Briefcase":
      return <Briefcase className={className} />;
    case "GraduationCap":
      return <GraduationCap className={className} />;
    case "TrendingUp":
      return <TrendingUp className={className} />;
    case "Mail":
      return <Mail className={className} />;
    case "Linkedin":
      return <Linkedin className={className} />;
    case "Github":
      return <Github className={className} />;
    case "BookOpen":
      return <BookOpen className={className} />;
    case "Globe":
      return <Globe className={className} />;
    case "Facebook":
      return <Facebook className={className} />;
    case "Instagram":
      return <Instagram className={className} />;
    case "Code":
      return <Code className={className} />;
    case "FileText":
      return <FileText className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    default:
      return <ExternalLink className={className} />;
  }
}


