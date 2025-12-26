# Roil's Portfolio | 逋ｽ遏ｳ螟ｧ譎ｴ縺ｮ繝昴・繝医ヵ繧ｩ繝ｪ繧ｪ

An HCI-focused portfolio built with Next.js 16, React 19, and TypeScript, showcasing creative technical work and portfolio projects.

**Live Demo**: [https://my-portfolio-ruby-delta-87.vercel.app](https://my-portfolio-ruby-delta-87.vercel.app)

---

## Key Features

- **Hero Section**: Clear introduction and overview copy
- **Portfolio Showcase**: 7 diverse projects including Three.js 3D modeling, Blender work, and generative art
- **Hierarchical Skills Display**: Organized tool sections with categories (Languages, Frameworks, Hardware)
- **Responsive Design**: Full mobile support
- **Production Security**: Configured security headers (X-Frame-Options, CSP policies)
- **Bilingual Support**: Japanese and English content throughout

---

## Tech Stack

- **Runtime**: Node.js 18+ (recommended)
- **Framework**: Next.js 16.0.7 (App Router)
- **React**: 19.2.0
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 with PostCSS
- **Code Quality**: ESLint
- **Hosting**: Vercel

---

## Project Structure

```
C:\Users\rinky\my-portfolio/
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   └── page.tsx          # Main page composition
│   │   ├── layout.tsx            # Root layout with metadata/SEO
│   │   ├── globals.css           # Global styles
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   └── favicon.ico
│   ├── components/
│   │   └── sections/             # Page sections
│   │       ├── Hero.tsx
│   │       ├── About.tsx
│   │       ├── Works.tsx
│   │       ├── Contact.tsx
│   │       └── Footer.tsx
│   ├── content/                  # Data files (TypeScript)
│   │   ├── works.ts
│   │   ├── about.ts
│   │   └── contact.ts
│   └── types/
│       └── content.ts            # TypeScript type definitions
├── public/
│   └── images/                   # Portfolio project images
├── next.config.ts                # Security headers configuration
├── tsconfig.json                 # TypeScript strict mode settings
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

**Key Architecture Patterns**:
- **Data-driven**: All content stored in `.ts` files, not hardcoded in components
- **Type safety**: TypeScript interfaces for all data structures
- **Separation of concerns**: Components focus on rendering, data files on content

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm package manager

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Roiril/my-portfolio.git
cd my-portfolio

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

### First-Time Setup Customization

When setting up your own portfolio:
1. Update `metadataBase` URL in `src/app/layout.tsx` for your deployment
2. Add your Google Search Console verification token in `src/app/layout.tsx`
3. Update social links in `src/content/contact.ts`
4. Replace project images in `public/images/` with your own
5. Modify project data in `src/content/works.ts` for your portfolio

---

## Development Workflow

### Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Create production build
npm start        # Run production server locally
npm run lint     # Run ESLint code quality checks
```

### Customizing Content

**Project Data** (`src/content/works.ts`):
- Add/remove work entries with title, description, tags, links
- Set `featured: true` to highlight a project on the homepage
- Link types: `'demo'` (interactive), `'video'` (YouTube), `'launch'` (live site)

**About Section** (`src/content/about.ts`):
- Update bio paragraphs
- Add/remove tool sections and categories
- Organize tools hierarchically (Section > Category > Items)

**Social Links** (`src/content/contact.ts`):
- Update social media URLs
- Modify contact message

**Images**:
- Place files in `public/images/`
- Hero background: `Roil_hci_icon.png`
- Project thumbnails: Referenced in `works.ts`

### Styling

- **Tailwind CSS 4** with PostCSS for styling
- No additional UI component libraries (pure Tailwind)
- Custom animations in component files (CSS-in-JS)
- Responsive breakpoints: sm, md, lg

### SEO & Metadata

Configure in `src/app/layout.tsx`:
- Open Graph (OGP) tags for social sharing
- Twitter Card configuration
- Google Search Console verification

---

## Deployment

### Vercel Deployment (Recommended)

**Method 1: Auto-deploy from Git**
1. Push to GitHub
2. Connect repository to Vercel dashboard
3. Vercel auto-deploys on every push to main branch

**Method 2: Manual deployment**
```bash
npm run build
vercel deploy --prod
```

### Environment Setup

No environment variables required for basic functionality. Add `.env.local` if using database or external services in the future.

### Production Security

Security headers configured in `next.config.ts`:
- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (MIME type detection)
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Disables camera, microphone, geolocation

### Performance Optimization

- Next.js 16 automatic code splitting
- Image optimization with next/image (when applicable)
- Font optimization with next/font (Inter from Google Fonts)
- Metadata auto-compression

### Current Deployment

- **Live URL**: https://my-portfolio-ruby-delta-87.vercel.app
- **Auto-deploys**: On commits to main branch

---

## Architecture & Design Decisions

### Why This Architecture?

**Data-Driven Design**:
- Content stored in separate TypeScript files, not hardcoded in components
- **Benefits**: Easy to update portfolio without touching component logic, single source of truth, type safety

**Component Organization**:
- Section components live in src/components/sections
- Page composition lives in src/app/(site)/page.tsx
- Content and types live in src/content and src/types

**HCI-Focused Design Principles**:
- Interaction metaphors and responsive feedback
- Responsive feedback (cursor changes, animations)
- Accessibility: Semantic HTML, proper navigation
- Visual hierarchy: Typography, spacing, color contrast

---

## Notable Features Deep Dive

### 1. Portfolio Project System

Works section showcases 7 diverse projects (src/content/works.ts):
- **Featured project** displayed prominently (Three.js Portfolio)
- Remaining projects in responsive grid (2-3 columns)
- Each project includes: Image, title, description, tags, action links
- Link types: demo (interactive), video (YouTube), launch (live site)
- Project metadata fully typed in TypeScript

**Notable Projects**:
- **Retro TV Portfolio**: Three.js 3D modeling with Next.js
- **CubeDiary**: Web app with 3D space interaction
- **Digital Twin: Meiji University**: Blender photorealistic architecture modeling
- **AI-Augmented Composition**: Human + AI music collaboration

### 2. Skills/Tools Organization

Hierarchical tool display in About section (src/content/about.ts):
- **Top level**: Tool sections (Making in AI Nature, Core Making Stack)
- **Second level**: Categories (Languages, Frameworks, Tools, Hardware)
- **Bottom level**: Individual tools with optional descriptions
- Visual presentation: Responsive grid with badge-style items

---

## Customization & Contributing

### Making This Your Own

**Step 1: Fork & Clone**
```bash
# Create your own fork on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/my-portfolio.git
cd my-portfolio
```

**Step 2: Customize Content**
- Update `src/content/works.ts` with your projects
- Update `src/content/about.ts` with your bio and skills
- Update `src/content/contact.ts` with your social links
- Replace `public/images/` with your project images

**Step 3: Configure Metadata**
- Edit `src/app/layout.tsx`:
  - Change metadataBase URL
  - Update title and description
  - Add Google Search Console verification
  - Update OGP image and Twitter card

**Step 4: Customize Styling** (Optional)
- Tailwind CSS is configured in `tailwind.config.ts`
- Component-specific animations in component files
- Global styles in `src/app/globals.css`

**Step 5: Deploy**
- Push to GitHub
- Connect to Vercel
- Auto-deploy on push

### Code Quality Standards

- ESLint enabled: `npm run lint`
- TypeScript strict mode for type safety
- Comments explain complex logic when needed
- Component props properly typed

### Pull Request Process

For improvements or bug fixes:
- Ensure `npm run lint` passes
- Add meaningful commit messages
- Create PR with description of changes

---

## Troubleshooting

### Build Fails with TypeScript Errors

**Solution**: Run `npm install` to ensure all types are installed. Check `tsconfig.json` settings match your Node.js version.

### Development Server Won't Start

**Solution**: Kill process on port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Images Not Loading in Production

**Solution**: Ensure images are in `public/` directory. Check image paths in component files match public directory structure.

### Drag Interactions Not Working on Mobile

**Solution**: Check browser console for interaction errors and verify component event handlers.

### Deployment Shows Old Content

**Solution**: Clear Vercel cache (Project Settings 竊・Deployments 竊・Redeploy) or make a new commit to main branch.

### SEO Not Working

**Solution**: Verify metadataBase URL in layout.tsx matches your deployment domain. Wait 48 hours for Google to re-crawl. Submit URL to Google Search Console manually.

---

## Learning Resources

### To Understand This Project Better

- [Next.js 16 App Router](https://nextjs.org/docs/app)
- [React 19 Latest Features](https://react.dev/)
- [TypeScript for React](https://www.typescriptlang.org/docs/handbook/react.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HCI Principles (Nielsen Norman Group)](https://www.nngroup.com/articles/)

### Technologies Used

- [Three.js (for portfolio projects)](https://threejs.org/)
- [Vercel Deployment](https://vercel.com/docs)
- [Web Accessibility (WCAG)](https://www.w3.org/WAI/)

---

## License & Attribution

**License**: MIT License - Feel free to use this as a template for your own portfolio.

**Author**: Roil (逋ｽ遏ｳ螟ｧ譎ｴ)
- Meiji University, Faculty of Science and Engineering
- HCI Research Focus
- Contact: See social links in portfolio

**Attribution**: If you use this template as a starting point, attribution is appreciated but not required.

---

## Contact & Social

**Get in Touch**:
- **YouTube**: [@Roil_HCI](https://www.youtube.com/@Roil_HCI)
- **X/Twitter**: [@Roil_HCI](https://x.com/Roil_HCI)
- **Portfolio**: [https://my-portfolio-ruby-delta-87.vercel.app](https://my-portfolio-ruby-delta-87.vercel.app)

**Interested in HCI, Generative Art, or Interactive Design?**

Open to collaboration and discussion. Feel free to reach out for project inquiries.

---

**Built with** 笶､・・**by Roil | 逋ｽ遏ｳ螟ｧ譎ｴ**









