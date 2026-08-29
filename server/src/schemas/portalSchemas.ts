import { z } from 'zod';

export const BRANCH_ENUM = z.enum([
  'AIML',
  'CSE',
  'ME',
  'CE',
  'ECO',
  'ECE',
  'BIOTECHNOLOGY',
]);

export const YEAR_ENUM = z.enum([
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
]);

export const DOMAIN_ENUM = z.enum([
  'Web AND Tech',
  'Graphic Designer',
  'General Management',
  'Photography',
  'Content Writing',
  'Promotion And Outreach',
]);

export const SocialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Must be a valid URL'),
});

export const JoinApplicationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .transform((val) => val.trim()),
  rollNo: z
    .string()
    .min(1, 'Roll number is required')
    .max(9, 'Roll number can have up to 9 numbers only')
    .regex(/^\d{1,9}$/, 'Roll number must contain digits only'),
  email: z
    .string()
    .email('Valid institutional or personal email is required')
    .transform((val) => val.trim().toLowerCase()),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Phone number must be a valid 10-digit Indian mobile number'),
  branch: BRANCH_ENUM,
  year: YEAR_ENUM,
  domain: DOMAIN_ENUM,
  sop: z
    .string()
    .min(20, 'Statement of purpose must be at least 20 characters')
    .max(2000, 'Statement of purpose cannot exceed 2000 characters'),
  experience: z.string().max(1000).optional().default(''),
  links: z.array(SocialLinkSchema).optional().default([]),
  turnstileToken: z.string().optional(),
});

export type JoinApplicationInput = z.infer<typeof JoinApplicationSchema>;

export const ContactMessageSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email is required').transform((val) => val.trim().toLowerCase()),
  subject: z.string().min(3, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000),
  type: z.enum(['student', 'sponsor', 'startup', 'speaker', 'other']).default('student'),
  organization: z.string().max(150).optional().default(''),
  turnstileToken: z.string().optional(),
});

export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;
