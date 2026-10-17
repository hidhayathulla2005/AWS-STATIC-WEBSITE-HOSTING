# VacayTours — Cloud-Hosted Static Web Application

> **Project Evaluation Submission**  
> **Course / Subject:** Cloud Computing & Web Technologies  
> **Topic:** End-to-End Static Website Architecture & Hosting on Amazon Web Services (AWS)  
> **Author:** Student / Independent Developer  
> **Repository:** [VacayTours Web Project](.)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Architecture & Cloud Workflow](#key-architecture--cloud-workflow)
3. [Technology Stack](#technology-stack)
4. [Frontend Highlights & Features](#frontend-highlights--features)
5. [Project Directory Structure](#project-directory-structure)
6. [Comprehensive AWS Hosting Guide (Step-by-Step)](#comprehensive-aws-hosting-guide-step-by-step)
   - [Step 1: Codebase Preparation & Local Testing](#step-1-codebase-preparation--local-testing)
   - [Step 2: Amazon S3 Bucket Creation](#step-2-amazon-s3-bucket-creation)
   - [Step 3: Configuring Static Website Hosting](#step-3-configuring-static-website-hosting)
   - [Step 4: Setting Up S3 Public Read Bucket Policy](#step-4-setting-up-s3-public-read-bucket-policy)
   - [Step 5: Uploading Files via Console & AWS CLI](#step-5-uploading-files-via-console--aws-cli)
   - [Step 6: Endpoint Testing & 404 Handling](#step-6-endpoint-testing--404-handling)
   - [Step 7: Production CDN & SSL via CloudFront (HTTPS)](#step-7-production-cdn--ssl-via-cloudfront-https)
   - [Step 8: Domain Mapping via Route 53 (Optional)](#step-8-domain-mapping-via-route-53-optional)
7. [Automated CI/CD Pipeline with GitHub Actions](#automated-cicd-pipeline-with-github-actions)
8. [Cross-Browser Testing & Performance](#cross-browser-testing--performance)
9. [Viva & Evaluation Q&A Preparation](#viva--evaluation-qa-preparation)

---

## Project Overview

**VacayTours** is a modern, responsive, performance-focused travel and tourism web application engineered using vanilla web standards (Semantic HTML5, Modular CSS3, and ES6+ JavaScript). It is specifically built to demonstrate the principles of cloud-native static website deployment on **Amazon Web Services (AWS)**.

The project does not rely on heavy runtime JavaScript frameworks (such as React, Angular, or Vue), resulting in:
- **Zero build dependencies**: No compilation or transpilation needed.
- **Instant load times**: Minimal payload size and sub-second First Contentful Paint (FCP).
- **High cost efficiency**: Extremely low compute overhead, running 100% on AWS serverless static storage and edge CDN caching.
- **100% responsive & accessible**: Meets WCAG 2.1 AA accessibility standards with full keyboard navigation and mobile drawer support.

---

## Key Architecture & Cloud Workflow

```
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|               User Browser (Mobile, Tablet, Desktop)                            |
+---------------------------------------------------------------------------------+
                                       |
                                       | 1. DNS Query (vacaytours.com)
                                       v
+---------------------------------------------------------------------------------+
|                              AMAZON ROUTE 53                                    |
|                      (Highly Available Cloud DNS Service)                       |
+---------------------------------------------------------------------------------+
                                       |
                                       | 2. Resolves to CloudFront Edge Anycast IP
                                       v
+---------------------------------------------------------------------------------+
|                             AMAZON CLOUDFRONT                                   |
|                      (Global Content Delivery Network)                          |
|  - Edge Caching (450+ Points of Presence)                                       |
|  - Free SSL/TLS Termination via AWS Certificate Manager (ACM)                   |
|  - Auto HTTP to HTTPS Redirection                                               |
+---------------------------------------------------------------------------------+
                                       |
                                       | 3. Origin Request (Cache Miss)
                                       v
+---------------------------------------------------------------------------------+
|                                 AMAZON S3                                       |
|                         (Simple Storage Service)                                |
|  - Bucket: Static Website Hosting Mode                                          |
|  - Index Document: index.html                                                   |
|  - Error Document: error.html                                                   |
|  - Granular Bucket Policy (s3:GetObject)                                        |
+---------------------------------------------------------------------------------+
```

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Markup** | HTML5 (Semantic) | Document outline, accessibility attributes (ARIA), Open Graph meta tags |
| **Styling** | CSS3 (Custom Properties) | CSS Grid, Flexbox, Fluid Typography (`clamp`), CSS Variables |
| **Behavior** | Vanilla JavaScript (ES6+) | DOM Manipulation, IntersectionObserver, Lightbox, Form Validation |
| **Typography** | Google Fonts | `DM Sans` (Clean body text) & `Playfair Display` (Editorial serif) |
| **Cloud Storage** | Amazon S3 | Highly scalable (99.999999999% durability) static asset hosting |
| **CDN & Security**| Amazon CloudFront | Low latency global edge caching and HTTPS SSL encryption |
| **DNS Management**| Amazon Route 53 | Scalable cloud Domain Name System (DNS) web service |
| **Security / SSL**| AWS Certificate Manager | Automated, managed public TLS/SSL certificates |

---

## Frontend Highlights & Features

1. **Sticky Header & Responsive Navigation:**
   - Translucent glassmorphism header with backdrop blur.
   - Accessible mobile menu drawer with dynamic ARIA attributes and burger/close animation.
2. **Dynamic Destination Filter:**
   - Real-time client-side category filtering (Beaches, Mountains, Nature, Heritage, All).
   - Dynamic empty-state detection and feedback.
3. **Tour Package Catalog & Wishlist:**
   - Category filtering dropdown with instant card rearrangement.
   - Interactive favorite/save button with visual heart toggle and animated toast notifications.
4. **Quick Booking Router:**
   - "Enquire" buttons automatically prefill the target package and destination into the contact form and trigger smooth scrolling.
5. **Full-Featured Photo Lightbox:**
   - High-resolution modal viewer with slide transitions.
   - Full keyboard accessibility: cycle photos with Left/Right arrow keys and exit with `Escape`.
   - Backdrop click detection to dismiss.
6. **Form Validation with Zero Dependencies:**
   - Real-time client validation for name length, email regex, destination selection, and message length.
   - Accessible error messaging (`role="status"`, `aria-live="polite"`).
7. **Scroll Reveal Animations:**
   - Smooth staggered entrance effects powered by native `IntersectionObserver` with fallback for legacy environments.

---

## Project Directory Structure

```text
AWS STATIC WEBSITE/
│
├── index.html          # Core single-page layout and semantic HTML structure
├── style.css           # Design tokens, layout grids, components, and media queries
├── script.js          # Interactive features, lightbox, filter logic, and validation
├── error.html          # Custom 404 error page configured for S3 static website hosting
├── .gitignore          # Git exclusion rules for editor caches and system files
└── README.md           # Complete technical documentation and deployment guide
```

---

## Comprehensive AWS Hosting Guide (Step-by-Step)

This guide walks through configuring Amazon Web Services from scratch to host this static website with maximum reliability, security, and global availability.

---

### Step 1: Codebase Preparation & Local Testing

Before deploying to the cloud, ensure all assets reside in the project root directory and test locally:

1. Open a terminal in the project directory:
   ```bash
   cd "D:\AWS STATIC WEBSITE"
   ```
2. Test locally using Python's built-in HTTP server or VS Code Live Server:
   ```bash
   # Using Python 3
   python -m http.server 8080
   ```
3. Open your browser and navigate to `http://localhost:8080` to verify:
   - Navigation links scroll smoothly to sections.
   - Filter chips toggle destinations without errors in the browser console.
   - Lightbox modal opens on gallery click and responds to `Escape`.
   - Contact form triggers validation when submitted empty.

---

### Step 2: Amazon S3 Bucket Creation

Amazon Simple Storage Service (Amazon S3) provides object storage with industry-leading scalability, data availability, security, and performance.

1. Sign in to the **AWS Management Console** ([aws.amazon.com/console](https://aws.amazon.com/console/)).
2. In the top search bar, type **S3** and select **S3**.
3. Click the orange **Create bucket** button.
4. Configure bucket settings:
   - **Bucket name:** Enter a globally unique, DNS-compliant name (e.g., `vacaytours-static-web-2026`).
     > *Note: If you plan to map a custom domain like `vacaytours.com`, the bucket name must exactly match your domain name.*
   - **AWS Region:** Select the region closest to your audience (e.g., `ap-south-1` for Mumbai, or `us-east-1` for N. Virginia).
   - **Object Ownership:** Leave as **ACLs disabled (recommended)**.
   - **Block Public Access settings for this bucket:**
     - **Uncheck** `Block all public access`.
     - Check the acknowledgment box: *"I acknowledge that the current settings might result in this bucket and the objects within it becoming public."*
   - **Bucket Versioning:** Keep disabled (or enable if you wish to retain file history).
   - **Default Encryption:** Keep **Server-side encryption with Amazon S3 managed keys (SSE-S3)**.
5. Click **Create bucket** at the bottom.

---

### Step 3: Configuring Static Website Hosting

1. Click on your newly created bucket name to open its details.
2. Navigate to the **Properties** tab.
3. Scroll all the way to the bottom to find the **Static website hosting** card.
4. Click **Edit**.
5. Select:
   - **Static website hosting:** `Enable`
   - **Hosting type:** `Host a static website`
   - **Index document:** `index.html`
   - **Error document:** `error.html`
6. Click **Save changes**.
7. Note down the **Bucket website endpoint** displayed at the bottom of the card:
   ```
   http://<your-bucket-name>.s3-website.<aws-region>.amazonaws.com
   ```

---

### Step 4: Setting Up S3 Public Read Bucket Policy

By default, even when "Block Public Access" is unchecked, S3 objects remain private until an explicit bucket policy grants read access.

1. Navigate to the **Permissions** tab of your bucket.
2. Scroll to the **Bucket policy** section and click **Edit**.
3. Paste the following JSON policy into the editor (replace `YOUR-BUCKET-NAME` with your actual S3 bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

#### Explanation of Policy Directives:
- **Version:** Specifies the language syntax version (`2012-10-17`).
- **Effect:** `Allow` permits access to the specified resources.
- **Principal:** `*` applies the permission anonymously to any internet user.
- **Action:** `s3:GetObject` restricts public users to reading files only (no delete, list, or write permissions).
- **Resource:** `arn:aws:s3:::YOUR-BUCKET-NAME/*` ensures all files inside the bucket inherit this read access.

4. Click **Save changes**. The bucket badge will now display a red **"Public"** label.

---

### Step 5: Uploading Files via Console & AWS CLI

You can upload your website files using either the graphical console or the AWS command line.

#### Option A: Via AWS Management Console
1. Navigate to the **Objects** tab of your bucket.
2. Click **Upload**.
3. Click **Add files** and select:
   - `index.html`
   - `style.css`
   - `script.js`
   - `error.html`
4. Verify that each file has the correct Content-Type (automatically detected as `text/html`, `text/css`, and `application/javascript`).
5. Click **Upload**.

#### Option B: Via AWS Command Line Interface (CLI)
For automated, professional deployments, install the [AWS CLI](https://aws.amazon.com/cli/) and run:

```bash
# 1. Configure AWS credentials (one-time setup)
aws configure

# 2. Synchronize all local files directly into the S3 bucket
aws s3 sync "D:\AWS STATIC WEBSITE" s3://YOUR-BUCKET-NAME --exclude ".git/*" --exclude ".gitignore" --exclude "README.md"
```

---

### Step 6: Endpoint Testing & 404 Handling

1. Copy your S3 Website Endpoint URL from **Properties** > **Static website hosting**:
   ```
   http://vacaytours-static-web-2026.s3-website.ap-south-1.amazonaws.com
   ```
2. Open the URL in an Incognito / Private browser window.
3. Verify that the homepage renders completely with CSS styling and functional JavaScript.
4. Append an invalid route to test the error document, for example:
   ```
   http://vacaytours-static-web-2026.s3-website.ap-south-1.amazonaws.com/non-existent-page
   ```
   Confirm that your custom `error.html` page displays cleanly with a button to navigate back to `index.html`.

---

### Step 7: Production CDN & SSL via CloudFront (HTTPS)

While Amazon S3 natively serves static content over HTTP, modern web standards require **HTTPS** (SSL/TLS). **Amazon CloudFront** adds global edge caching, DDoS protection, and HTTPS termination.

```
User (HTTPS:443)  --->  CloudFront Edge  --->  S3 Bucket Origin
```

1. In the AWS Console, search for **CloudFront** and click **Create distribution**.
2. **Origin domain:** Enter the S3 website endpoint (e.g. `YOUR-BUCKET.s3-website.ap-south-1.amazonaws.com`).
   > *Best Practice:* Use the website endpoint rather than the S3 bucket REST endpoint if you rely on S3 default root object resolution and error document routing.
3. **Default cache behavior:**
   - **Viewer protocol policy:** Select **Redirect HTTP to HTTPS**.
   - **Allowed HTTP methods:** Select **GET, HEAD**.
   - **Cache policy:** Select **CachingOptimized** (recommended for static assets).
4. **Web Application Firewall (WAF):** Choose *Do not enable security protections* (for free evaluation tier).
5. Click **Create distribution**.
6. CloudFront will deploy globally across edge locations (takes 2–4 minutes).
7. Copy the generated **Distribution domain name** (e.g., `d111111abcdef8.cloudfront.net`) and test it in your browser with `https://`.

---

### Step 8: Domain Mapping via Route 53 (Optional)

If connecting a custom domain (e.g., `vacaytours.com`):

1. **Request an SSL Certificate:**
   - In AWS Certificate Manager (ACM), switch region to **US East (N. Virginia) `us-east-1`** (required for CloudFront distributions).
   - Request a public certificate for `vacaytours.com` and `*.vacaytours.com`.
   - Validate via DNS record in Route 53.
2. **Attach Certificate to CloudFront:**
   - In your CloudFront distribution settings, add Alternate Domain Names (CNAMEs): `vacaytours.com`.
   - Select the Custom SSL certificate from ACM.
3. **Create Route 53 Alias Record:**
   - Go to Route 53 > **Hosted Zones** > your domain.
   - Click **Create record**.
   - Record type: `A - Routes traffic to an IPv4 address`.
   - Toggle **Alias** to ON.
   - Route traffic to: **Alias to CloudFront distribution**.
   - Select your CloudFront distribution domain name.
   - Click **Save**.

---

## Automated CI/CD Pipeline with GitHub Actions

To simulate a production deployment workflow, you can automate syncing changes directly from a GitHub repository to AWS S3.

Create the file `.github/workflows/deploy.yml`:

```yaml
name: Deploy Static Website to AWS S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Sync Files to S3 Bucket
        run: |
          aws s3 sync . s3://${{ secrets.S3_BUCKET_NAME }} \
            --exclude ".git/*" \
            --exclude ".github/*" \
            --exclude ".gitignore" \
            --exclude "README.md" \
            --delete

      - name: Invalidate CloudFront Cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

---

## Cross-Browser Testing & Performance

| Environment | Supported Versions | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Google Chrome** | v90+ (Desktop & Mobile) | Passed | Full hardware acceleration on zoom animations |
| **Mozilla Firefox**| v88+ (Desktop & Android) | Passed | Smooth scroll and backdrop-filter verified |
| **Apple Safari** | v14+ (macOS & iOS) | Passed | `-webkit-backdrop-filter` enabled for sticky navbar |
| **Microsoft Edge** | v90+ (Windows & Mac) | Passed | Full keyboard focus and accessibility confirmed |

### Performance Metrics:
- **Page Weight:** ~28 KB (gzipped HTML/CSS/JS excluding external Unsplash imagery).
- **Requests:** 3 local assets (`index.html`, `style.css`, `script.js`) + external web fonts.
- **Serverless Uptime:** 99.99% backed by AWS S3 Service Level Agreement.

---

## Viva & Evaluation Q&A Preparation

Here are answers to common questions asked during academic and technical evaluations:

### Q1: Why host a static website on Amazon S3 instead of launching an EC2 instance?
> **Answer:** An Amazon EC2 instance requires continuous provisioning, operating system patching, security updates, load balancers, and costs money 24/7 even when idle. Amazon S3 static website hosting is completely **serverless**, scales automatically from zero to millions of visitors, has built-in 99.999999999% (11 9's) durability, and only incurs costs for actual storage and data transfer (pennies per month).

### Q2: What is the difference between an S3 REST Endpoint and an S3 Website Endpoint?
> **Answer:** 
> - **S3 REST Endpoint** (`<bucket>.s3.<region>.amazonaws.com`) requires authenticated requests unless public, supports API operations (PUT, DELETE), and does **not** automatically serve `index.html` as the default root object or rewrite error documents.
> - **S3 Website Endpoint** (`<bucket>.s3-website.<region>.amazonaws.com`) acts as an HTTP web server. It natively resolves index documents, routes 4xx errors to custom error pages, and supports HTTP redirects.

### Q3: Why is Amazon CloudFront used in combination with S3?
> **Answer:** S3 static hosting only supports HTTP (unencrypted) endpoints. CloudFront provides:
> 1. **HTTPS encryption** with custom SSL/TLS certificates.
> 2. **Low-latency caching** across 450+ Points of Presence globally.
> 3. **Origin shielding and DDoS mitigation** via AWS Shield Standard.
> 4. **Cost reduction** through reduced direct GET requests against S3.

### Q4: How is security maintained if the S3 bucket is public?
> **Answer:** The bucket policy explicitly restricts actions to `s3:GetObject`. Public users have **read-only** permissions. They cannot list other buckets, delete files, or upload malicious content (`s3:PutObject` is denied). In production with CloudFront, we can even restrict S3 to **Origin Access Control (OAC)**, making S3 completely private while CloudFront is the only authorized entity allowed to fetch objects.

---

## License & Attribution

- **Project:** Educational demonstration of AWS Cloud Hosting.
- **Photography:** Royalty-free high-resolution imagery provided by [Unsplash](https://unsplash.com).
- **Fonts:** Open-source Google Fonts ([DM Sans](https://fonts.google.com/specimen/DM+Sans) & [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)).
