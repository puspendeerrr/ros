# Restaurant OS — Phase 1 (Core QR Menu Builder Only) Rules & Scope

This rule file acts as the ultimate scope gatekeeper for **Restaurant OS**. No features outside of the Phase 1 QR Menu Builder scope should ever be implemented or planned.

---

## 1. Product Vision Constraints

**Restaurant OS is NOT a Restaurant Management System, POS, ERP, or billing manager.** It is a SaaS platform dedicated exclusively to helping restaurants manage and share beautiful Digital Menus and QR Codes.

### Core Allowed Modules:
1. **Authentication**: Sign Up, Log In, Password Reset, Email Verification, JWT and Refresh Token flows.
2. **Restaurant Profile**: Name, Logo, Cover, Phone, WhatsApp, Maps Link, Business Hours, Address, and Styling Slug.
3. **Menu Builder**: Categories (CRUD + Reordering), Items (Images, Price ₹, Veg/Non-Veg, Bestseller, Availability toggles, tags), and image cropping/compression.
4. **QR Generator**: High-resolution print-ready SVG/PNG/PDF QR codes with logo overlays and custom color schemes.
5. **Public Digital Menu**: Customer-facing web menu (veg filters, search bar, contact/WhatsApp links, category chips, responsive dark/light theme, PWA cache).
6. **Analytics**: Limited ONLY to menu interactions (today/weekly scan counters, popular category/item clicks, peak times, top devices).
7. **Theme Builder**: Predefined luxury, minimalist, cafe, and traditional templates.
8. **Settings**: Simple configurations (Profile, Password, Danger Zone deletions).

---

## 2. Hard Restrictions (DO NOT BUILD)

❌ **POS & Billing**: No inventory, purchase orders, table bill calculations, GST, or invoices.
❌ **Operations & Staffing**: No waiter apps, kitchen display systems (KDS), payroll, attendance, or supplier management.
❌ **Ordering & Payments**: No customer table ordering, online ordering checkouts, payment gateway integrations, or checkout flows.
❌ **Bookings**: No table reservations, queue registers, or CRM loyalty programs.

---

## 3. Design & Performance Philosophy

* **Mobile-First**: Always decouple UI layouts into distinct desktop and mobile components inside `features/{module}/desktop` and `features/{module}/mobile` rather than adding inline `isMobile` blocks.
* **Simple & Obvious UX**: Use Indian examples, currency symbols (₹), and simple large action cards over complex tabular sheets.
* **API Cache Layering**: Defer to Redis caching and React Query updates to minimize database hits.
