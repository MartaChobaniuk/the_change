import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './index.scss';
import { Root } from './Root';
import { EventsProvider } from './store/EventsContex';
import { AuthProvider } from 'react-oidc-context';
import { OpportunityProvider } from './store/OpportunityContex';

const cognitoAuthConfig = {
  authority:
    'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_uHcVQq9Cg',
  client_id: '7f4n0jvd5vp0g8ji7p6ppe4gke',
  redirect_uri: 'https://thechange.netlify.app/',
  scope: 'aws.cognito.signin.user.admin email openid profile',
};

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <AuthProvider {...cognitoAuthConfig}>
    <OpportunityProvider>
      <EventsProvider>
        <Root />
      </EventsProvider>
    </OpportunityProvider>
  </AuthProvider>,
);
