import Config from 'react-native-config'
import Amplify from 'aws-amplify';

Amplify.configure({
    Auth: {
        identityPoolId: Config.identityPoolId,
        region: Config.region,
        userPoolId: Config.userPoolId,
        userPoolWebClientId: Config.userPoolWebClientId,
    },
    Storage: {
      AWSS3: {
        bucket: 'inventoli-env', //REQUIRED -  Amazon S3 bucket,
        region: 'us-east-2',
      }
    }
});
