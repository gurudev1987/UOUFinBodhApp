import React from 'react';
import { StyleSheet, View, Button, Alert, TouchableOpacity, Text, Image, useWindowDimensions,ScrollView } from 'react-native';
import { router, useRouter } from 'expo-router';

export default function Expolre() {
  const {width,height}= useWindowDimensions();
  const tabwidth= width * 0.30;
  const tabheight=  width * 0.40;
  const router = useRouter();
  return (

    <View style={styles.container}>
      {/* Container to hold the two buttons side by side */}
      <ScrollView>
      <View style={styles.container1}>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() =>  router.push('/test')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
             style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
            
          </TouchableOpacity>
          <Text style={styles.buttonText}>INDIAN FINANCIAL SYSTEM</Text>
        </View>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
            style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>INVESTMENT BASIC</Text>
        </View>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
              style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
          </TouchableOpacity>
            <Text style={styles.buttonText}>FINANCIAL MANAGEMENT</Text>
        </View>
       
      </View>
    <View style={styles.container1}>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
             style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
            
          </TouchableOpacity>
          <Text style={styles.buttonText}>BASIC ACCOUNTING</Text>
        </View>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
            style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>CORPORATE TAX PLANNING</Text>
        </View>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
              style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
          </TouchableOpacity>
            <Text style={styles.buttonText}>CYBER SECURITY</Text>
        </View>
       
      </View>
      <View style={styles.container1}>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
             style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
            
          </TouchableOpacity>
          <Text style={styles.buttonText}>DIGITAL PAYMENT SYSTEM</Text>
        </View>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
            style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>WORKING PROFESSIONAL</Text>
        </View>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
              style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
          </TouchableOpacity>
            <Text style={styles.buttonText}>NON WORKING</Text>
        </View>
       
      </View>
      <View style={styles.container1}>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
             style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
            
          </TouchableOpacity>
          <Text style={styles.buttonText}>ENTERPRENUERS</Text>
        </View>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
            style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>FARMERS</Text>
        </View>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
              style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
          </TouchableOpacity>
            <Text style={styles.buttonText}>SELF-HELP GROUP</Text>
        </View>
       
      </View>
      <View style={styles.container1}>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
             style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
            
          </TouchableOpacity>
          <Text style={styles.buttonText}>SENIOR CITIZENS</Text>
        </View>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
            style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>STUDENTS</Text>
        </View>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
              style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
          </TouchableOpacity>
            <Text style={styles.buttonText}>RURAL LANDSCAPE</Text>
        </View>
       
      </View>
      <View style={styles.container1}>
        <View style={{width: tabwidth, height: tabheight, alignItems: 'center',marginRight:10}}>
          <TouchableOpacity style={[styles.button,{width: tabwidth, height: width*0.3, alignItems: 'center',backgroundColor:'#D3D3D3'}]}
            onPress={() => Alert.alert('Custom button pressed')}
          >
            <Image
              source={require('@/assets/images/linkimage.jpeg')}
             style={{width: width*0.2, height: width*0.2, borderRadius: width*0.2, alignContent:'center'}}
            />
            
          </TouchableOpacity>
          <Text style={styles.buttonText}>FINANCIAL SCHEMES</Text>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center', // Centers the buttons vertically in the screen
    backgroundColor: '#0d0d1a',
    alignItems: 'center', // Centers the buttons horizontally in the screen
    //flexDirection: 'row', // Aligns buttons horizontally
    //marginHorizontal: 20, // Adds horizontal margin to the container
  },
  container1: {
    justifyContent: 'center', // Centers the buttons vertically in the screen
    backgroundColor: '#0d0d1a',
    alignItems: 'center', // Centers the buttons horizontally in the screen
    flexDirection: 'row', // Aligns buttons horizontally
    marginHorizontal:5, // Adds horizontal margin to the container
    marginTop:20,
    color:'#FFFFFF',
  },
  buttonContainer: {
    flex: 1, // Allows buttons to share available space equally
    marginHorizontal: 10, // Adds space between the buttons
  },
  button: {
    backgroundColor: '#D3D3D3', // This sets the background color
    //paddingVertical: 12,
    //paddingHorizontal:5 ,
    justifyContent: 'center',
    borderRadius: 8,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  buttonText: {
    color: 'white', // Sets the text color
    fontSize: 10,
    textAlign: 'center',
    marginTop:10,
    fontWeight: 'bold',
  },
  // image: {
  //   width: 150, // Set an equal width
  //   height: 150, // Set an equal height
  //   borderRadius: 75, // Set the border radius to half of the width/height (150 / 2 = 75)
  // },
  row: {
    // Inner view arranges buttons horizontally
    flexDirection: 'row',
    justifyContent: 'space-around', // Distributes space evenly around buttons
    marginBottom: 20, // Adds space between the two rows
  },
});

