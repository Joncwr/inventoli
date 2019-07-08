import Amplify from '@aws-amplify/core';
import Config from 'react-native-config'

export function configureAmplify() {
  Amplify.configure(
  {
   Auth: {
     identityPoolId: Config.identityPoolId,
     region: Config.region,
     userPoolId: Config.userPoolId,
     userPoolWebClientId: Config.userPoolWebClientId,
    },
  Storage: { 
     bucket: Config.bucket_name,
     region: Config.region,
     identityPoolId: Config.identityPoolId
    }
  }
 );
}
