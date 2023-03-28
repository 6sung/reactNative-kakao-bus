import {Ionicons} from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { COLOR } from './color';

export default ({
    onPress,
    style,
}) => {
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <Ionicons 
                name="alarm-outline" 
                size={24} 
                color={COLOR.GRAY_3} />
        </TouchableOpacity>
    );
}