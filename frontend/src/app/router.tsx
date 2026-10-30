import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteLoader } from "@/components/common/RouteLoader";
import { RouteErrorPage } from "@/components/common/RouteErrorPage";
import { HomePage } from "@/pages/HomePage";
import { hasSection } from "@/services/extraPages";

const named = <T extends string>(loader: () => Promise<Record<T, React.ComponentType>>, name: T) =>
  lazy(() => loader().then((m) => ({ default: m[name] })));

// The home page is bundled with the shell for the fastest first paint; every
// other page is split into its own chunk and preloaded on link hover.
const ContentPage = lazy(() => import("@/pages/ContentPage").then((m) => ({ default: m.ContentPage })));
const DynamicContentPage = named(() => import("@/pages/DynamicContentPage"), "DynamicContentPage");
const InstitutionsPage = named(() => import("@/pages/InstitutionsPage"), "InstitutionsPage");
const InstitutionDetailPage = named(() => import("@/pages/InstitutionDetailPage"), "InstitutionDetailPage");
const DirectoryPage = named(() => import("@/pages/DirectoryPage"), "DirectoryPage");
const ContactPage = named(() => import("@/pages/ContactPage"), "ContactPage");
const GalleryPage = named(() => import("@/pages/GalleryPage"), "GalleryPage");
const PublicationsPage = named(() => import("@/pages/PublicationsPage"), "PublicationsPage");
const SafeguardingPage = named(() => import("@/pages/SafeguardingPage"), "SafeguardingPage");
const OurLifePage = named(() => import("@/pages/OurLifePage"), "OurLifePage");
const NewsPage = named(() => import("@/pages/NewsPage"), "NewsPage");
const NoticesPage = named(() => import("@/pages/NoticesPage"), "NoticesPage");
const NotFoundPage = named(() => import("@/pages/NotFoundPage"), "NotFoundPage");
const ReflectionsPage = named(() => import("@/pages/ReflectionsPage"), "ReflectionsPage");
const ProvincialCouncilPage = named(() => import("@/pages/ProvincialCouncilPage"), "ProvincialCouncilPage");
const ProvinceTeamsPage = named(() => import("@/pages/ProvinceTeamsPage"), "ProvinceTeamsPage");
const ProvincialMessagePage = named(() => import("@/pages/ProvincialMessagePage"), "ProvincialMessagePage");
const PreparingPage = named(() => import("@/pages/PreparingPage"), "PreparingPage");
const JubileeVibesPage = named(() => import("@/pages/NewsFlashPage"), "JubileeVibesPage");
const NewsFlashListPage = named(() => import("@/pages/NewsFlashPage"), "NewsFlashListPage");

const AdminRoot = lazy(() => import("@/admin/AdminRoot"));
const AdminLayout = lazy(() => import("@/admin/AdminLayout"));
const AdminLoginPage = named(() => import("@/admin/AdminLoginPage"), "AdminLoginPage");
const AdminRegisterPage = named(() => import("@/admin/AdminRegisterPage"), "AdminRegisterPage");
const AdminDashboardPage = named(() => import("@/admin/AdminDashboardPage"), "AdminDashboardPage");
const AdminNewsPage = named(() => import("@/admin/AdminNewsPage"), "AdminNewsPage");
const AdminNoticesPage = named(() => import("@/admin/AdminNoticesPage"), "AdminNoticesPage");
const AdminGalleryPage = named(() => import("@/admin/AdminGalleryPage"), "AdminGalleryPage");
const AdminMessagesPage = named(() => import("@/admin/AdminMessagesPage"), "AdminMessagesPage");
const AdminAccountPage = named(() => import("@/admin/AdminAccountPage"), "AdminAccountPage");

const wrap = (node: ReactNode) => <Suspense fallback={<RouteLoader />}>{node}</Suspense>;
const content = (slug: string) => wrap(<ContentPage slug={slug} />);
/** Pages from the Province's content document: "not found" until the page has been added. */
const later = (slug: string) => (hasSection(slug) ? content(slug) : wrap(<PreparingPage />));

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },

      // About Us
      { path: "who-we-are/founder", element: content("our-founder") },
      { path: "who-we-are/history", element: content("our-history") },
      { path: "who-we-are/missionary-work", element: content("missionary-work") },
      { path: "who-we-are/vision-mission", element: content("vision-mission") },
      { path: "who-we-are/province-profile", element: content("province-profile") },
      { path: "who-we-are/our-presence", element: content("the-congregation-worldwide") },
      { path: "worldwide", element: content("the-congregation-worldwide") },

      // Province leadership
      { path: "administration/provincial-superiors", element: content("provincial-superiors") },
      { path: "administration/team", element: content("administration-team") },
      { path: "administration/commissions", element: content("province-commissions") },

      // Mission
      { path: "ministries/education", element: content("education") },
      { path: "ministries/health-care", element: content("health-care") },
      { path: "ministries/social-work", element: content("social-work") },
      { path: "ministries/pastoral-evangelization", element: content("pastoral-and-evangelization") },
      { path: "ministries/eco-friendliness", element: content("eco-friendliness-and-protection") },
      { path: "ministries/safeguarding", element: wrap(<SafeguardingPage />) },

      // Community
      { path: "who-we-are/our-life", element: wrap(<OurLifePage />) },
      { path: "ministries/formation", element: content("formation") },
      { path: "contact/convents", element: wrap(<DirectoryPage />) },

      // Institutions
      { path: "institutions", element: wrap(<InstitutionsPage />) },
      { path: "institutions/:id", element: wrap(<InstitutionDetailPage />) },
      { path: "institution-profiles", element: content("institutions") },

      // Media
      { path: "news", element: wrap(<NewsPage />) },
      { path: "notices", element: wrap(<NoticesPage />) },
      { path: "publications", element: wrap(<PublicationsPage />) },
      { path: "gallery", element: wrap(<GalleryPage />) },

      // Contact
      { path: "contact", element: wrap(<ContactPage />) },

      // Pages added from the Province's content document
      { path: "mission/jmj-subodha-centre", element: later("jmj-subodha-centre") },
      { path: "province/provincial-message", element: wrap(<ProvincialMessagePage />) },
      { path: "province/teams", element: wrap(<ProvinceTeamsPage />) },
      { path: "province/provincial-chapter-2023", element: later("provincial-chapter-2023") },
      { path: "province/provincial-council", element: wrap(<ProvincialCouncilPage />) },
      { path: "news-flash", element: wrap(<NewsFlashListPage />) },
      { path: "news-flash/jubilee-vibes", element: wrap(<JubileeVibesPage />) },
      { path: "province/direction-statement", element: later("direction-statement") },
      { path: "spirituality/charism", element: later("spirituality-charism") },
      { path: "spirituality/life-with-god", element: later("life-with-god") },
      { path: "spirituality/prayers", element: later("congregation-prayers") },
      { path: "joining-us/becoming-a-jmj-sister", element: later("becoming-a-jmj-sister") },
      { path: "joining-us/lay-association", element: later("lay-association") },
      { path: "joining-us/whom-to-contact", element: content("whom-to-contact") },
      { path: "mary-glowrey/life", element: later("mary-glowrey-life") },
      { path: "mary-glowrey/reflection", element: later("mary-glowrey-reflection") },
      { path: "mary-glowrey/prayers", element: later("mary-glowrey-prayers") },
      { path: "mary-glowrey/intercessions", element: later("mary-glowrey-intercessions") },
      { path: "reflections", element: wrap(<ReflectionsPage />) },

      { path: "content/:slug", element: wrap(<DynamicContentPage />) },
      { path: "*", element: wrap(<NotFoundPage />) },
    ],
  },
  {
    // Staff area: its own layout, no public header or footer.
    path: "admin",
    element: wrap(<AdminRoot />),
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "login", element: wrap(<AdminLoginPage />) },
      { path: "register", element: wrap(<AdminRegisterPage />) },
      {
        element: wrap(<AdminLayout />),
        children: [
          { path: "dashboard", element: wrap(<AdminDashboardPage />) },
          { path: "news", element: wrap(<AdminNewsPage />) },
          { path: "notices", element: wrap(<AdminNoticesPage />) },
          { path: "gallery", element: wrap(<AdminGalleryPage />) },
          { path: "messages", element: wrap(<AdminMessagesPage />) },
          { path: "account", element: wrap(<AdminAccountPage />) },
          { path: "*", element: <Navigate to="/admin/dashboard" replace /> },
        ],
      },
    ],
  },
]);
