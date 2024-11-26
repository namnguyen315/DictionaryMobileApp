// IconSymbol.js
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Zocial from '@expo/vector-icons/Zocial';

// Define the type for the icon provider
type IconProvider = 'MaterialIcons' | 'FontAwesome' | 'Ionicons' | 'AntDesign' | 'EvilIcons' | 'FontAwesome5' | 'Feather' | 'Fontisto' | 'Foundation' | 'MaterialCommunityIcons' | 'Octicons' | 'SimpleLineIcons' | 'Zocial';

// Map the provider names to the actual icon components
const ICON_PROVIDERS = {
MaterialIcons,
FontAwesome,
Ionicons,
AntDesign,
EvilIcons,
FontAwesome5,
Feather,
Fontisto,
Foundation,
MaterialCommunityIcons,
Octicons,
SimpleLineIcons,
Zocial,
};

/**
* An icon component that allows users to specify the icon provider and name directly.
*/
export function IconSymbol({
name,
size = 24,
color,
style,
provider = 'MaterialIcons', // Default provider
}: {
name: string; // Directly use the icon name
size?: number;
color: string | OpaqueColorValue;
style?: StyleProp<ViewStyle>;
provider?: IconProvider;
}) {
const IconComponent = ICON_PROVIDERS[provider];

return <IconComponent color={color} size={size} name={name} style={style} />;
}