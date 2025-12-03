import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './app/screens/Home';
import OverViewScreen from './app/screens/OverView';
import SettingScreen from './app/screens/Setting';
import { tabColors, headerColors } from './app/constants/colors';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'List') {
                            iconName = focused ? 'list' : 'list-outline';
                        } else if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Setting') {
                            iconName = focused ? 'settings' : 'settings-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: tabColors.active,
                    tabBarInactiveTintColor: tabColors.inactive,
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        right: 20,
                        height: 70,
                        borderRadius: 20,
                        backgroundColor: tabColors.background,
                        borderTopWidth: 0,
                        paddingBottom: 10,
                        paddingTop: 10
                    },
                    tabBarShowLabel: false,
                    headerStyle: {
                        backgroundColor: headerColors.background,
                    },
                    headerTintColor: headerColors.text,
                    headerTitleStyle: {
                        fontWeight: '700',
                    },
                })}
            >
                <Tab.Screen 
                    name="List" 
                    component={OverViewScreen}
                    options={{ title: '목록' }}
                />
                <Tab.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{ title: '홈' }}
                />
                <Tab.Screen 
                    name="Setting" 
                    component={SettingScreen}
                    options={{ title: '설정' }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
