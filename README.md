## Momentum

Momentum is a project management and invoicing platform built for freelancers, independent contractors, and small businesses. It brings projects, clients, invoices, and collaboration into one streamlined experience, with transparent pricing and secure Stripe-powered payments.

### Key Features
- **Account creation**: Sign up with Google, GitHub, or Email; choose Monthly or Yearly plans.
- **Stripe integration**: Securely connect your Stripe account to create, send, and manage invoices.
- **User dashboard**: Track projects, milestones, and progress; manage customers and billing.
- **Client dashboard**: Clients can view progress, milestones, and pay invoices securely.
- **Invoicing**: Create invoices from your customer list; send via email with secure payment links.
- **Project pages**: Organize milestones, deadlines, files, and status in one place.
- **Optional collaboration tools**: Enable per-project live chat, file uploads, and a color theme picker when useful.

### Screenshots
Assets are available under `public/` (e.g., `dashboard.png`, `invoice.png`, `project.png`) and are used across the About pages for previews.

---

## Tech Stack

- **Framework**: Next.js 15, React 19
- **Language**: TypeScript + JavaScript (hybrid repo)
- **Styling**: Tailwind CSS, `tailwindcss-animate`, `tailwind-merge`
- **Payments**: Stripe (`stripe`, `@stripe/stripe-js`)
- **Auth/Backend**: Firebase (`firebase`, `@firebase/auth`)
- **Email**: SendGrid (`@sendgrid/mail`)
- **UX/Components**: `framer-motion`, `lucide-react`, `react-icons`, `class-variance-authority`, `clsx`
- **Rich text**: Tiptap (`@tiptap/*`)
- **Images/Palette**: `node-vibrant`, `chroma-js`, `react-palette`
- **Utilities**: `date-fns`, `uuid`, `react-toastify`, `react-textarea-autosize`, `react-paginate`
- **Analytics**: `@vercel/analytics`, `@vercel/speed-insights`
- **Sitemap/SEO**: `next-sitemap`

---

## Project Structure (high level)

- `src/app` — Next.js App Router pages and API routes
  - `About/[activeSection]` — Dynamic About pages that render feature walkthroughs
  - `api/stripe/*` — Stripe integration endpoints (connect, customers, invoices, portal, OAuth, etc.)
  - `api/send*` — Email-related endpoints (welcome, newsletter, project notifications)
- `src/components` — UI components (dashboards, tables, payments, landing)
- `src/context` — Providers (e.g., auth)
- `public` — Static assets, favicons, screenshots

---

## Notable Flows

- **Onboarding**: Create an account → choose a plan → (optionally) connect Stripe.
- **Invoicing**: From the customer list, click “Create Invoice” → fill details → send email → client pays via secure Stripe link.
- **Client portal**: Clients can view project progress, milestones, and pay invoices.
- **Optional project features**: Per-project live chat, file uploads, and color theme picker can be enabled when needed.

---

## SEO & Metadata
Dynamic metadata for About subsections is generated in `src/app/About/[activeSection]/page.jsx`, including titles, descriptions, and canonical URLs based on `siteMetadata`.

---

## Author

Created by **Jared Hooker**.

---

## License

This project is licensed under the terms of the license found in `LICENSE`.


