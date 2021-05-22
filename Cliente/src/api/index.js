import Auth0 from 'react-native-auth0';

const url = 'www.4closely.com';

export const notificacionesEndpoint = `http://${url}`;

export const eventosEndpoint = `http://${url}`;

export const gruposEndpoint = `http://${url}`;

export const videoEndpoint = `www.4closely.com`;


export const auth0 = new Auth0({
    domain: 'closely.auth0.com',
    clientId: 'zw4LQeIIAgz7MaYDzOPtWSa0ETniNZiy',
});
