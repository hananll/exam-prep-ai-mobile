import { useCallback } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from './src/screens/HomeScreen';
import SubjectTopicsScreen from './src/screens/SubjectTopicsScreen';
import QuestionScreen from './src/screens/QuestionScreen';
import AnswerResultScreen from './src/screens/AnswerResultScreen';
import QuizSummaryScreen from './src/screens/QuizSummaryScreen';
import QuestionReviewScreen from './src/screens/QuestionReviewScreen';
import LoginScreen from './src/screens/LoginScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  SubjectTopics: undefined;
  Question: undefined;
  AnswerResult: undefined;
  QuizSummary: undefined;
  QuestionReview: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    BesleyRegular: require('./assets/fonts/Besley-Regular.ttf'),
    BesleyBold: require('./assets/fonts/Besley-Bold.ttf'),
    BesleyItalic: require('./assets/fonts/Besley-Italic.ttf'),
    RethinkSansRegular: require('./assets/fonts/RethinkSans-Regular.ttf'),
    RethinkSansSemiBold: require('./assets/fonts/RethinkSans-SemiBold.ttf'),
    RethinkSansBold: require('./assets/fonts/RethinkSans-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="SubjectTopics"
            component={SubjectTopicsScreen}
          />
          <Stack.Screen name="Question" component={QuestionScreen} />
          <Stack.Screen
            name="AnswerResult"
            component={AnswerResultScreen}
          />
          <Stack.Screen name="QuizSummary" component={QuizSummaryScreen} />
          <Stack.Screen
            name="QuestionReview"
            component={QuestionReviewScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}