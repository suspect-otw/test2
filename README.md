<div align="center">
<a href="https://music-campaign.netlify.app">
  <img alt="Music Campaign" src="https://github.com/suspect-otw/test2/blob/main/app/logo.png">
  <h1 align="center">Music Campaing</h1>
</a>
</div>

<p align="center">
 Simple CRUD and Auth with Supabase and Next JS
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-netlify"><strong>Deploy to Netlify</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
</p>
<br/>

## Features

- **Next JS & Supabase Auth Project**
  - **Login Page**
    - Admin login with email and password.
  - **Dashboard Homepage**
    - Displays a list of all music campaigns.
    - Admin can perform CRUD operations on each campaign.
  - **Create Campaign**
    - A form where the admin can input:
      - Campaign Title
      - Brand Name
      - Start Date and End Date
      - Budget
      - Image Upload (e.g., campaign banner)
      - Campaign Description
  - **Update Campaign**
    - A form for editing all campaign details (including image and description).
  - **Delete Campaign**
    - A delete button for removing a campaign from the system.
- **supabase-ssr**: A package to configure Supabase Auth to use cookies
- **Styling** with [Tailwind CSS](https://tailwindcss.com)
- **Components** with [shadcn/ui](https://ui.shadcn.com/)
- **Optional deployment** with [Netlify](#deploy-to-netlify)

## Demo

You can view a fully working demo at [music-campaign.netlify.app](https://music-campaign.netlify.app/).

## Deploy to Netlify

Netlify deployment will guide you through creating a project and link it to your github account.

After going over steps you can publish a working copy either with only changing the env file with your credentials.

If you wish to just develop locally and not deploy to Netlify, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Clone/Download this repo to your machine with these command:

   ```bash
   git clone https://github.com/suspect-otw/test2.git
   ```
   using GitHub CLI:

    ```bash
    gh repo clone suspect-otw/test2
    ```

3. Use `cd` to change into the app's directory

   ```bash
   cd test2
   ```

4. Rename `.env.example` to `.env.local` and update the following variables with your own credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   DATABASE_URL=[INSERT YOUR CONNECTION STRING FOR DRIZZLE ORM]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm install
   npm run dev
   ```

   Its should now be running on [localhost:3000](http://localhost:3000/).

6. I used default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)