import { useCallback } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from './src/screens/HomeScreen';
import SubjectTopicsScreen from './src/screens/SubjectTopicsScreen';
import QuestionScreen, { SoruApi } from './src/screens/QuestionScreen';
import AnswerResultScreen from './src/screens/AnswerResultScreen';
import QuizSummaryScreen from './src/screens/QuizSummaryScreen';
import QuestionReviewScreen from './src/screens/QuestionReviewScreen';
import KatieChatScreen from './src/screens/KatieChatScreen';
import LoginScreen from './src/screens/LoginScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  SubjectTopics: undefined;
  Question: { testId?: number; lessonName?: string };
  AnswerResult: { testId?: number; lessonName?: string };
  QuizSummary: {
    testId?: number;
    resultData: {
      testAdi: string;
      toplamSoru: number;
      dogruSayisi: number;
      yanlisSayisi: number;
      gecenSure: string;
      konuAnalizleri: Array<{ konuAdi: string; dogru: number; toplam: number }>;
      sorular?: SoruApi[];
      userAnswers?: { [soruId: number]: string };
    };
  };
  QuestionReview: {
    sorular: SoruApi[];
    userAnswers: { [soruId: number]: string };
    testAdi?: string;
    dogru?: number;
    yanlis?: number;
  };
  KatieChat: {
    soruId?: number;
    soruMetni?: string;
    userAnswer?: string;
    correctAnswer?: string;
    explanation?: string;
  };
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
          <Stack.Screen name="KatieChat" component={KatieChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}