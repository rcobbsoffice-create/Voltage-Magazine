export type UserRole = 'USER' | 'WRITER' | 'ADMIN';

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    bio?: string;
    isProWriter?: boolean; // For monetized writers
}

export interface WriterProfile extends UserProfile {
    role: 'WRITER';
    expertise: string[]; // e.g. ["Hip Hop", "Indie", "Production"]
    rating: number; // 0-5 stars
    completedJobs: number;
    hourlyRate?: number; // For "Hire a Writer" feature
    portfolio: Article[];
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    coverImage: string;
    excerpt: string;
    content: string; // Markdown or HTML
    author: WriterProfile;
    publishedAt: string;
    isPremium: boolean; // For Monetization
}
