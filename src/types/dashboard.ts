import type { IconName } from "@/components/atoms/Icon";

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  active?: boolean;
};

export type QuickAction = {
  title: string;
  subtitle: string;
  href: string;
};

export type FollowUpTask = {
  id: string;
  title: string;
  dueLabel: string;
  priority: "High" | "Medium" | "Low";
};

export type PerformanceStat = {
  label: string;
  value: string;
  changeLabel: string;
  trend: "up" | "down";
};

export type BranchUser = {
  name: string;
  branch: string;
  initials: string;
};
