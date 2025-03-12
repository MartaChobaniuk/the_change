import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-north-1',
});

const cognito = new AWS.CognitoIdentityServiceProvider();

export default cognito;
