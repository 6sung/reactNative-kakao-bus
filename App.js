import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { RefreshControl, SafeAreaView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BusInfo from './src/BusInfo';
import { COLOR } from './src/color';
import { busStop, getBusNumColorByType , getSections, getRemainedTimeText, getSeatStatusText} from './src/data';
import {Ionicons} from '@expo/vector-icons';
import {SimpleLineIcons} from '@expo/vector-icons';
import Margin from './src/Margin';
import BookmarkButton from './src/BookmarkButton';
import { useTheme } from './src/use-theme';

export default function App() {
  const sections = getSections(busStop.buses);
  const [now,setNow] = useState(dayjs());
  const [refreshing, setRefreshing] = useState(false);

  const onPressBusStopBookmark = () => {

  };

  const ListHeaderComponent = () => (
    <View style={{
      backgroundColor:COLOR.GRAY_3,
      height:200,
      justifyContent: "center", 
      alignItems: "center",
    }}>
      
      <Text style={{ color: COLOR.WHITE, fontSize: 13 }}>{busStop.id}</Text>
        <Margin height={10} />
        <Margin height={4} />

        <Text style={{ color: COLOR.WHITE, fontSize: 20 }}>{busStop.name}</Text>
        <Margin height={4} />

        <Text style={{ color: COLOR.GRAY_1, fontSize: 14 }}>{busStop.directionDescription}</Text>
        <Margin height={20} />

        <BookmarkButton 
          isBookmarked={busStop.isBookmarked}
          onPress={onPressBusStopBookmark}
          size={20}
          style={{
            borderWidth : 0.3,
            borderColor : COLOR.GRAY_1,
            borderRadius : 16,
            padding : 6,
          }}
        />
        <Margin height={25} />
    </View>
  )

  const renderSectionHeader = ({section:{title}}) => (
    <View style={{
      paddingLeft:13,
      paddingVertical:3, 
      backgroundColor:COLOR.GRAY_1,
      borderTopWidth : 0.5,
      borderBottomWidth : 0.5,
      borderTopColor:COLOR.GRAY_2,
      borderBottomColor : COLOR.GRAY_2,
    }}>
      <Text style={{fontSize:12, color:COLOR.GRAY_4}}>{title}</Text>
    </View>
    
  );

  const renderItem = ({item : bus}) => {
    const numColor = getBusNumColorByType(bus.type);

    const firstNextBusInfo = bus.nextBusInfos?.[0] ?? null; 
    const secondNextBusInfo = bus.nextBusInfos?.[1] ?? null;
    const newNextBusInfos =
      !firstNextBusInfo && !secondNextBusInfo
        ? [null]
        : [firstNextBusInfo, secondNextBusInfo];

    // if (bus.num === 2000) {
    //   console.log(bus.num, 'newNextBusInfos', newNextBusInfos); // TODO: 확인
    // }

    const processedNextBusInfos = newNextBusInfos.map((info) => {
      if (!info)
        return {
          hasInfo: false,
          remainedTimeText: "도착 정보 없음",
      };

      const { arrivalTime, numOfRemainedStops, numOfPassengers } = info;
      const remainedTimeText = getRemainedTimeText(now, arrivalTime);
      const seatStatusText = getSeatStatusText(bus.type, numOfPassengers);
      return {
        hasInfo: true,
        remainedTimeText,
        numOfRemainedStops,
        seatStatusText,
      };
  });

    return(
      <BusInfo 
        isBookmarked={bus.isBookmarked}
        onPressBookmark={() => {}}
        num={bus.num}
        directionDescription={bus.directionDescription}
        numColor={numColor}
        processedNextBusInfos = {processedNextBusInfos}
      />
    )
  };

  const ItemSeparatorComponent = () => (
    <View style={{width:"100%", height:1, backgroundColor:COLOR.GRAY_1}}/>
  );
  const ListFooterComponent = () => (
    <Margin height={30} />
  )
  const onRefresh = () => {
    console.log('call refresh')
    setRefreshing(true);
  }
  useEffect(() => {
    if(refreshing){
      setNow(dayjs());
      setRefreshing(false);
      /*setTimeout(()=>{
        setRefreshing(false);
        setNow(dayjs());
      },3000);*/
    }
  },[refreshing]);


  useEffect(() => {
    const interval = setInterval(()=> {
      const newNow = dayjs();
      setNow(newNow);
    },1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>

      <View style={{backgroundColor:COLOR.GRAY_3,width:"100%" ,justifyContent:"center", height:80}}>
        <SafeAreaView style={{flexDirection:"row", justifyContent:"space-between"}}>
          <TouchableOpacity style={{padding:10}}>
            <SimpleLineIcons name='arrow-left' size={20}  color={COLOR.WHITE} />
          </TouchableOpacity>
          
          <TouchableOpacity style={{padding:10}}>
            <SimpleLineIcons name='home' size={20}  color={COLOR.WHITE} />
          </TouchableOpacity> 
        </SafeAreaView>
      </View>
      
      <SectionList 
        style={{flex:1,width:"100%"}}
        sections={sections}
        ListHeaderComponent={ListHeaderComponent}
        renderSectionHeader = {renderSectionHeader}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={ListFooterComponent}
        refreshControl = {
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}/>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
