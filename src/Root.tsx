import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './pages/HomePage';
import { StoriesPage } from './pages/StoriesPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';
import { Path } from './utils/constants';
import { HomeAIPage } from './pages/HomeAIPage';
import { MenuPage } from './pages/MenuPage';
import { LogInPage } from './pages/LogInPage';
import { FaqPage } from './pages/FaqPage';
import { ExploreAllPage } from './pages/ExploreAllPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProfileInfoPage } from './pages/ProfileInfoPage';
import { ProfileActivityPage } from './pages/ProfileActivityPage';
import { ProfileOpportunitiesPage } from './pages/ProfileOpportunitiesPage';
import { StepOnePage } from './pages/StepOnePage';
import { StepTwoPage } from './pages/StepTwoPage';
import { StepThreePage } from './pages/StepThreePage';
import { VolunteeringPage } from './pages/VolunteeringPage';
import { WishesPage } from './pages/WishesPage';
import { DonatePage } from './pages/DonatePage';
import { SuccessSubmitPage } from './pages/SuccessSubmit';
import { NotFoundPage } from './pages/NotFoundPage';

export const Root = () => (
  <Router>
    <Routes>
      <Route path={Path.Home} element={<App />}>
        <Route index element={<HomePage />} />

        <Route path={Path.Explore}>
          <Route index element={<ExploreAllPage />} />
          <Route path=":eventId" element={<EventDetailsPage />} />
        </Route>

        <Route path={Path.Volunteering}>
          <Route index element={<VolunteeringPage />} />
          <Route path=":eventId" element={<EventDetailsPage />} />
        </Route>

        <Route path={Path.Wishes}>
          <Route index element={<WishesPage />} />
          <Route path=":eventId" element={<EventDetailsPage />} />
        </Route>

        <Route path={Path.Donate}>
          <Route index element={<DonatePage />} />
          <Route path=":eventId" element={<EventDetailsPage />} />
        </Route>

        <Route path={Path.HomeAI} element={<HomeAIPage />} />
        <Route path={Path.Stories} element={<StoriesPage />} />

        <Route path={Path.About}>
          <Route index element={<AboutUsPage />} />
          <Route path={Path.Faq} element={<FaqPage />} />
        </Route>

        <Route path={Path.Contact} element={<ContactPage />} />
        <Route path={Path.LogIn} element={<LogInPage />} />

        <Route path={Path.Profile}>
          <Route index element={<ProfilePage />} />
          <Route path={Path.ProfileInfo} element={<ProfileInfoPage />} />
          <Route path={Path.Activity} element={<ProfileActivityPage />} />

          <Route path={Path.Opportunities}>
            <Route index element={<ProfileOpportunitiesPage />} />
            <Route path={Path.StepOne} element={<StepOnePage />} />
            <Route path={Path.StepTwo} element={<StepTwoPage />} />
            <Route path={Path.StepThree} element={<StepThreePage />} />
          </Route>
        </Route>

        <Route path={Path.SuccessSubmit} element={<SuccessSubmitPage />} />

        <Route path={Path.Menu} element={<MenuPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </Router>
);
