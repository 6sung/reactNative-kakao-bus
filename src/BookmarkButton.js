import {Ionicons} from '@expo/vector-icons';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { COLOR } from './color';

const useBookmark = (initialIsBookmarked) => {
    const [isBookmarked,setIsBookmarked] = useState(initialIsBookmarked);
    const toggleIsBookmarked = () => setIsBookmarked(!isBookmarked);

    return{
        isBookmarked,
        toggleIsBookmarked,
    }
};

export default ({
    size,
    isBookmarked : isBookmarkedProp,
    onPress,
    style,
}) => {
    //const [isBookmarked,setIsBookmarked] = useState(isBookmarkedProp);
    const {isBookmarked,toggleIsBookmarked} = useBookmark(isBookmarkedProp);
    return (
        <TouchableOpacity style={style} onPress={() => {
            toggleIsBookmarked();
            onPress();
        }}>
            <Ionicons 
                name="star" 
                size={size} 
                color={isBookmarked ? COLOR.YELLOW : COLOR.GRAY_1 } />
        </TouchableOpacity>
    );
}