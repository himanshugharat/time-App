import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  StyleSheet,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Card, Input, Text} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from 'react-native-elements/dist/buttons/Button';
import {Divider} from 'react-native-elements';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import ImagePickerModel from '../../addOn/ImagePickerModel';
import VideoPickerModel from '../../addOn/VideoPickerModel';
import {IconButton} from 'react-native-paper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import RatingModel from '../../addOn/RatingModel';
import Mainsignature from '../../addOn/Mainsignature';
import {RNCamera} from 'react-native-camera';
import Map from './Map';
import axios from 'axios';
import {updateTaskAction} from '../../../store/taskAction';

const formschema = yup.object({
  'Person Met': yup.string().required(),
  'Phone Number': yup
    .number()
    .required()
    .test('10 dgiit phone number', '10 dgiit phone number', val => {
      return `${val}`.length == 10;
    }),
  'Engineer Comments': yup.string().required(),
  Reason: yup.string().required(),
  SubReason: yup.string().required(),
  // 'Customer Category': yup.string().required(),
  // 'Online Recharge Process Explained': yup.string().required(),
  // 'Purpose of Visit': yup.string().required(),
  // 'Amount Collected': yup.number(),
  // 'Any New Requirement': yup.string().required(),
  // 'Reason of DC': yup.string(),
  // 'Visit type': yup.string().required(),
});
const Technical = ({route, navigation}) => {
  Geocoder.init('AIzaSyA-e4KgoB0Bne0lsUGGaR1tZBtTI9U_WB0');
  const locationConfig = {
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
  };
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
  function onSuccess(e) {
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err),
    // );
    if (type === 'wifi') {
      setwifi(e.data);
    } else if (type === 'ssd') {
      setssd(e.data);
    } else if (type === 'stb') {
      setstb(e.data);
    }
    console.log(e.data);
    setModalVisible(!modalVisible);
  }

  // console.log('idLelo', route.params.data.id);
  const db = firestore();
  const localData = useSelector(state => state.localData);
  const [state, setstate] = useState('');
  const [type, settype] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [wifi, setwifi] = useState('');
  const [ssd, setssd] = useState('');
  const [stb, setstb] = useState('');

  const [flash, setflash] = useState(false);
  const [buttonGeo, setbuttonGeo] = useState(false);
  const [datepicker1, setdatepicker1] = useState(false);
  const [datefill, setdatefill] = useState(
    moment(new Date()).format('DD-MM-YYYY HH:mm:ss'),
  );
  const [datefill1, setdatefill1] = useState(
    moment(new Date()).format('DD-MM-YYYY HH:mm:ss'),
  );

  const getLocation = () => {
    Geolocation.setRNConfiguration(locationConfig);

    Geolocation.getCurrentPosition(data => {
      Geocoder.from(data.coords.latitude, data.coords.longitude).then(
        json => {
          console.log(json);
          var addressComponent = json.results[0].formatted_address;
          console.log(addressComponent);

          console.log(data);
          getData()
            .then(re => {
              console.log(re);
              db.collection('compnayTed')
                .doc('himan')
                // .collection('uer')
                // .doc(re.name)
                .collection('task')
                .doc(route.params.data.id.toString())
                .update({
                  HomelocationData: addressComponent,
                });
              console.log('in get data');
            })
            .then(() => {});
        },
        error => {
          console.log(
            'The location could not be loaded because ',
            error.message,
          ),
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000};

          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
          });
        },
      );
    });
  };
  const initateCall = () => {
    axios
      .get(
        'http://182.76.59.106:8080/CC/Asterisk/API/MB_C2C?api_key=crm_click2cal@88555&from=9619326197&to=9619326197',
      )
      .then(re => {
        console.log(re.status);
        setTimeout(() => {
          Alert.alert('Connecting to Server .....');
        }, 2000);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={{padding: 10}}>
      <ScrollView>
        <Map lat={18.875401311815477} lng={72.91770787661663} />
        {/* <Map lat={route.params.data.lat} lng={route.params.data.lng} /> */}
        <Card
          containerStyle={{
            margin: 10,
            borderRadius: 15,
            borderColor: '#5DADE2',
          }}>
          <Text style={styles.formTitle}>Task Detail</Text>
          <View style={formStyles.container}>
            <View style={formStyles.cardFlex}>
              <View style={formStyles.cardDetail}>
                <View style={formStyles.columnFlex}>
                  <Text style={formStyles.columnPlanTitle}>
                    Retailer Name :-
                  </Text>
                  <Text style={formStyles.columnPlanDetails}>
                    {route.params.data['Retailer Name']}
                  </Text>
                </View>
                {/* <View style={formStyles.columnFlex}>
                <Text style={formStyles.columnPlanTitle}>Retailer Id</Text>
                <Text style={formStyles.columnPlanDetails}>
                  : &nbsp;{route.params.data['Retailer Id']}
                </Text>
              </View> */}
                <View style={formStyles.columnFlex}>
                  <Text style={formStyles.columnPlanTitle}>
                    Retailer Address :-
                  </Text>
                  <Text style={formStyles.columnPlanDetails}>
                    {route.params.data['Retailer Address']}
                  </Text>
                </View>
                <View style={formStyles.columnFlex}>
                  <Text style={formStyles.columnPlanTitle}>
                    Problem Faced :-
                  </Text>
                  <Text style={formStyles.columnPlanDetails}>
                    {route.params.data['type']}
                  </Text>
                </View>
                <View style={formStyles.columnFlex}>
                  <Text style={formStyles.columnPlanTitle}>
                    Call Retailer :-
                  </Text>
                  <Text style={formStyles.columnPlanDetails}>
                    {' '}
                    <Icon
                      style={{fontSize: 30, padding: 10}}
                      name="phone"
                      type="font-awesome"
                      color="#f50"
                      iconStyle={{fontSize: 40}}
                      onPress={() => {
                        initateCall();
                      }}
                    />
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        <View style={{padding: 0}}>
          <Formik
            initialValues={{
              'Date of Visit': '',
              'Person Met': '',
              'Meter Reading': '',
              'Phone Number': '',
              'Engineer Comments': '',
              Reason: '',
              SubReason: '',
            }}
            onSubmit={(values, actions) => {
              console.log(values);
              getLocation();
              // actions.resetForm();
              getData()
                .then(re => {
                  console.log(re);
                  db.collection('stb')
                    .doc('himan')
                    .collection('task')
                    // .doc(re.companyName)
                    // .collection('uer')
                    // .doc(re.name)
                    // .collection('task')
                    .doc(route.params.data.id.toString())
                    .update({
                      ...values,
                      'Date of Visit': datefill,
                      SubReasonDate: datefill1,
                      taskstatus: 'done',
                    });
                })
                .then(navigation.navigate('top'));
              //   .then(
              //     navigation.navigate('Task Report', {data: route.params.data}),
              //   );
            }}
            validationSchema={formschema}>
            {formikProps => (
              <Card
                containerStyle={{
                  margin: 10,
                  borderRadius: 15,
                  borderColor: '#5DADE2',
                }}>
                <View style={{marginBottom: 10}}>
                  <Text style={[styles.formTitle, {paddingLeft: 10}]}>
                    Call / Visit Remark
                  </Text>
                  <Input
                    style={styles.inputField}
                    inputContainerStyle={{borderBottomColor: 'transparent'}}
                    errorStyle={{color: '#dc143c'}}
                    placeholder="Date of Visit"
                    label="Date of Visit"
                    labelStyle={styles.inputLabel}
                    onChangeText={formikProps.handleChange('Date of Visit')}
                    value={String(datefill)}
                    onBlur={formikProps.handleBlur('Date of Visit')}
                    disabled
                    errorMessage={
                      formikProps.touched['Date of Visit'] &&
                      formikProps.errors['Date of Visit']
                    }
                  />

                  <Text style={styles.pickerLabel}>Reason</Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: 'gray',
                      borderRadius: 4,
                      marginBottom: 10,
                      marginLeft: 10,
                      marginRight: 10,
                    }}>
                    <Picker
                      style={styles.picker}
                      selectedValue={
                        formikProps.touched['Reason'] &&
                        formikProps.values['Reason']
                      }
                      onValueChange={formikProps.handleChange('Reason')}
                      onBlur={formikProps.handleBlur('Reason')}>
                      <Picker.Item
                        style={styles.pickerPopUp}
                        label="Click To Select"
                        value="Click To Select"
                      />
                      <Picker.Item
                        style={styles.pickerPopUp}
                        label="Antenna"
                        value="Antenna"
                      />
                      <Picker.Item
                        style={styles.pickerPopUp}
                        label="STB"
                        value="STB"
                      />
                      <Picker.Item
                        style={styles.pickerPopUp}
                        label="SSD"
                        value="SSD"
                      />
                      <Picker.Item
                        style={styles.pickerPopUp}
                        label="WIFI"
                        value="WIFI"
                      />
                    </Picker>
                  </View>
                  <Text style={styles.errorMessage}>
                    {formikProps.touched['Reason'] &&
                      formikProps.errors['Reason']}
                  </Text>

                  {formikProps.values['Reason'] === 'Antenna' && (
                    <>
                      <Text style={styles.pickerLabel}>SubReason</Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: 'gray',
                          borderRadius: 4,
                          marginBottom: 10,
                          marginLeft: 10,
                          marginRight: 10,
                        }}>
                        <Picker
                          style={styles.picker}
                          selectedValue={
                            formikProps.touched['SubReason'] &&
                            formikProps.values['SubReason']
                          }
                          onValueChange={formikProps.handleChange('SubReason')}
                          onBlur={formikProps.handleBlur('SubReason')}>
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="Click To Select"
                            value="Click To Select"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="No / weak signal – Antenna peak tracking done"
                            value="No / weak signal – Antenna peak tracking done"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="No / weak signal – LNBF defective, to be replaced"
                            value="No / weak signal – LNBF defective, to be replaced"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="No / weak signal – connector defective, to be replaced"
                            value="No / weak signal – connector defective, to be replaced"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="No / weak signal – Cable defective, to be replaced"
                            value="No / weak signal – Cable defective, to be replaced"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="Physical damaged – To be replaced/chargeable"
                            value="Physical damaged – To be replaced/chargeable"
                          />
                        </Picker>
                      </View>
                      <Text style={styles.errorMessage}>
                        {formikProps.touched['SubReason'] &&
                          formikProps.errors['SubReason']}
                      </Text>
                    </>
                  )}
                  {formikProps.values['Reason'] === 'STB' && (
                    <>
                      <Text style={styles.pickerLabel}>Reason</Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: 'gray',
                          borderRadius: 4,
                          marginBottom: 10,
                          marginLeft: 10,
                          marginRight: 10,
                        }}>
                        <Picker
                          style={styles.picker}
                          selectedValue={
                            formikProps.touched['SubReason'] &&
                            formikProps.values['SubReason']
                          }
                          onValueChange={formikProps.handleChange('SubReason')}
                          onBlur={formikProps.handleBlur('SubReason')}>
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="Click To Select"
                            value="Click To Select"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="Dead – Adopter defective – To be replaced"
                            value="Dead – Adopter defective – To be replaced"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="Dead – Mains board defective – Repair done"
                            value="Dead – Mains board defective – Repair done"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="Dead - STB Faulty – To be replaced"
                            value="Dead - STB Faulty – To be replaced"
                          />
                        </Picker>
                      </View>
                      <Text style={styles.errorMessage}>
                        {formikProps.touched['SubReason'] &&
                          formikProps.errors['SubReason']}
                      </Text>
                    </>
                  )}
                  {formikProps.values['Reason'] === 'WIFI' && (
                    <>
                      <Text style={styles.pickerLabel}>Reason</Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: 'gray',
                          borderRadius: 4,
                          marginBottom: 10,
                          marginLeft: 10,
                          marginRight: 10,
                        }}>
                        <Picker
                          style={styles.picker}
                          selectedValue={
                            formikProps.touched['SubReason'] &&
                            formikProps.values['SubReason']
                          }
                          onValueChange={formikProps.handleChange('SubReason')}
                          onBlur={formikProps.handleBlur('SubReason')}>
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="Click To Select"
                            value="Click To Select"
                          />

                          <Picker.Item
                            style={styles.pickerPopUp}
                            label=" No power – WIFI defective, to be swapped"
                            value=" No power – WIFI defective, to be swapped"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="No power – Adopter faulty, to be replaced"
                            value="No power – Adopter faulty, to be replaced"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="No power – Loose connection / Mains board issue"
                            value="No power – Loose connection / Mains board issue"
                          />

                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="No net connectivity – Incorrect configuration "
                            value="No net connectivity – Incorrect configuration "
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="No net connectivity – LAN cable defective , to replaced"
                            value="No net connectivity – LAN cable defective , to replaced"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="No net connectivity – WIFI defective, to be replaced"
                            value="No net connectivity – WIFI defective, to be replaced"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="No net connectivity – STB defective, to be replaced"
                            value="No net connectivity – STB defective, to be replaced"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="No net connectivity  - LAN cable loose, reconnected"
                            value="No net connectivity  - LAN cable loose, reconnected"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="Physical damaged – To be replaced/chargeable"
                            value="Physical damaged – To be replaced/chargeable"
                          />
                        </Picker>
                      </View>
                      <Text style={styles.errorMessage}>
                        {formikProps.touched['SubReason'] &&
                          formikProps.errors['SubReason']}
                      </Text>
                    </>
                  )}

                  {formikProps.values['Reason'] === 'SIM' && (
                    <>
                      <Text style={styles.pickerLabel}>Reason</Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: 'gray',
                          borderRadius: 4,
                          marginBottom: 10,
                          marginLeft: 10,
                          marginRight: 10,
                        }}>
                        <Picker
                          style={styles.picker}
                          selectedValue={
                            formikProps.touched['SubReason'] &&
                            formikProps.values['SubReason']
                          }
                          onValueChange={formikProps.handleChange('SubReason')}
                          onBlur={formikProps.handleBlur('SubReason')}>
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="Click To Select"
                            value="Click To Select"
                          />

                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="SIM faulty – To be replaced"
                            value="SIM faulty – To be replaced"
                          />
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="SIM loose connection – Cleaned and re-inserted"
                            value="SIM loose connection – Cleaned and re-inserted"
                          />
                        </Picker>
                      </View>
                      <Text style={styles.errorMessage}>
                        {formikProps.touched['SubReason'] &&
                          formikProps.errors['SubReason']}
                      </Text>
                    </>
                  )}
                  {formikProps.values['Reason'] === 'SSD' && (
                    <>
                      <Text style={styles.pickerLabel}>Reason</Text>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: 'gray',
                          borderRadius: 4,
                          marginBottom: 10,
                          marginLeft: 10,
                          marginRight: 10,
                        }}>
                        <Picker
                          style={styles.picker}
                          selectedValue={
                            formikProps.touched['SubReason'] &&
                            formikProps.values['SubReason']
                          }
                          onValueChange={formikProps.handleChange('SubReason')}
                          onBlur={formikProps.handleBlur('SubReason')}>
                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="Click To Select"
                            value="Click To Select"
                          />

                          <Picker.Item
                            style={styles.pickerPopUp}
                            label="SSD faulty – to be replaced"
                            value="SSD faulty – to be replaced"
                          />
                        </Picker>
                      </View>
                      <Text style={styles.errorMessage}>
                        {formikProps.touched['SubReason'] &&
                          formikProps.errors['SubReason']}
                      </Text>
                    </>
                  )}
                  <Input
                    style={styles.inputField}
                    inputContainerStyle={{borderBottomColor: 'transparent'}}
                    errorStyle={{color: '#dc143c'}}
                    label="Person Met"
                    labelStyle={styles.inputLabel}
                    placeholder="Please Enter Person Name"
                    onChangeText={formikProps.handleChange('Person Met')}
                    value={formikProps.values['Person Met']}
                    onBlur={formikProps.handleBlur('Person Met')}
                    errorMessage={
                      formikProps.touched['Person Met'] &&
                      formikProps.errors['Person Met']
                    }
                  />

                  <Input
                    style={styles.inputField}
                    inputContainerStyle={{borderBottomColor: 'transparent'}}
                    errorStyle={{color: '#dc143c'}}
                    label="Phone Number"
                    labelStyle={styles.inputLabel}
                    placeholder="Phone Number"
                    onChangeText={formikProps.handleChange('Phone Number')}
                    value={formikProps.values['Phone Number']}
                    onBlur={formikProps.handleBlur('Phone Number')}
                    keyboardType="numeric"
                    maxLength={10}
                    errorMessage={
                      formikProps.touched['Phone Number'] &&
                      formikProps.errors['Phone Number']
                    }
                  />
                  <Input
                    multiline
                    style={{
                      borderColor: 'gray',
                      borderWidth: 1,
                      // height: 15,
                      alignItems: 'center',
                      backgroundColor: 'white',
                      borderRadius: 5,
                      fontSize: 14,
                      color: 'black',
                      fontFamily: 'Montserrat-Regular',
                      textTransform: 'capitalize',
                    }}
                    inputContainerStyle={{borderBottomColor: 'transparent'}}
                    errorStyle={{color: '#dc143c'}}
                    label="Engineer Comments"
                    labelStyle={styles.inputLabel}
                    placeholder="Engineer Comments"
                    onChangeText={formikProps.handleChange('Engineer Comments')}
                    value={formikProps.values['Engineer Comments']}
                    onBlur={formikProps.handleBlur('Engineer Comments')}
                    errorMessage={
                      formikProps.touched['Engineer Comments'] &&
                      formikProps.errors['Engineer Comments']
                    }
                  />

                  <Text style={styles.pickerLabel}>Upload Image or video</Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <Icon
                      style={{fontSize: 40, padding: 10}}
                      raised
                      name="camera"
                      type="font-awesome"
                      color="#0264d6"
                      onPress={() => {
                        // setreset(!reset);
                        // Snackbar.show({
                        //   text: 'reset search',
                        //   duration: Snackbar.LENGTH_SHORT,
                        // });
                        navigation.push('UploadImage', {
                          data: route.params.data,
                          name: 'stb',
                        });
                      }}
                    />
                    <Icon
                      raised
                      name="video-camera"
                      type="font-awesome"
                      color="#0264d6"
                      style={{fontSize: 40, padding: 10}}
                      onPress={() => {
                        // setreset(!reset);
                        // Snackbar.show({
                        //   text: 'reset search',
                        //   duration: Snackbar.LENGTH_SHORT,
                        // });
                        navigation.push('UploadVideo', {
                          data: route.params.data,
                          name: 'stb',
                        });
                      }}
                    />
                  </View>
                  <Text style={styles.pickerLabel}>Upload Signature</Text>
                  <Mainsignature
                    name="stb"
                    id={route.params.data.id.toString()}
                  />
                  <Text style={styles.pickerLabel}>Rate Engineer</Text>
                  <RatingModel
                    name="stb"
                    id={route.params.data.id.toString()}
                  />
                  <Button
                    type="outline"
                    title="Submit"
                    buttonStyle={styles.submitButton}
                    titleStyle={styles.submitTitle}
                    onPress={formikProps.handleSubmit}
                  />
                </View>
              </Card>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};

export default Technical;

const styles = StyleSheet.create({
  main: {
    padding: 10,
  },
  // inputField: {
  //   borderColor: 'gray',
  //   borderWidth: 1,
  //   height: 15,
  //   alignItems: 'center',
  //   backgroundColor: 'white',
  //   borderRadius: 5,
  //   fontSize: 14,
  //   color: 'black',
  // },
  // radioButton: {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   flexDirection: 'row',
  //   paddingTop: 10,
  // },
  // errorMessage: {
  //   color: '#dc143c',
  //   fontSize: 12,
  //   paddingLeft: 15,
  // },
  formHeader: {
    // textDecorationLine: 'underline',
    marginBottom: 10,
    textAlign: 'center',
    color: '#0264d6',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 30,
  },
  formTitle: {
    // textDecorationLine: 'underline',
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 22,
  },
  inputField: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 15,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 14,
    color: 'black',
    fontFamily: 'Montserrat-Regular',
    textTransform: 'capitalize',
  },
  inputLabel: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: 'normal',
    color: '#5d5d5d',
  },
  radioButton: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingTop: 10,
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#fff',
    marginRight: 10,
    marginLeft: 10,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: 'Montserrat-Regular',
    textTransform: 'capitalize',
  },
  errorMessage: {
    color: '#dc143c',
    fontSize: 12,
    paddingLeft: 15,
    fontFamily: 'Montserrat-Regular',
  },
  pickerLabel: {
    fontSize: 15,
    color: '#5d5d5d',
    // textDecorationLine: 'underline',
    marginLeft: 10,
    // marginTop: 10,
    fontFamily: 'Montserrat-Bold',
    fontWeight: 'normal',
  },
  picker: {
    color: '#000',
    fontFamily: 'Montserrat-Regular',
    fontWeight: 'normal',
  },
  pickerPopUp: {
    // color: '#fff',
    fontFamily: 'Montserrat-Regular',
    fontWeight: 'normal',
  },
  submitButton: {
    backgroundColor: '#008CBA',
    borderRadius: 50,
    marginTop: 10,
  },
  submitTitle: {
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
const formStyles = StyleSheet.create({
  cardFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  cardDetail: {
    display: 'flex',
    justifyContent: 'center',
    width: '80%',
  },
  columnFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  columnTitle: {
    // textDecorationLine: 'underline',
    fontFamily: 'Montserrat-SemiBold',
    width: '45%',
  },
  columnDetails: {
    fontFamily: 'Montserrat-Regular',
    textTransform: 'capitalize',
    width: '80%',
  },
  columnPlanTitle: {
    // textDecorationLine: 'underline',
    fontFamily: 'Montserrat-SemiBold',
    width: '70%',
    paddingBottom: 10,
  },
  columnPlanDetails: {
    fontFamily: 'Montserrat-Regular',
    textTransform: 'capitalize',
    width: '65%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
