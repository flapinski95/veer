import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import ThemeSwitch from '../components/themeSwitch';
import styles from '../styles/styles';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CountryPicker from '../components/CountryPicker';
import axios from 'axios';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .matches(/^\S+$/, 'No spaces allowed')
    .min(3, 'Minimum 3 characters')
    .max(20, 'Maximum 20 characters')
    .required('Required'),

  name: Yup.string()
    .trim()
    .matches(/^\S+$/, 'No spaces allowed')
    .min(3, 'Minimum 3 characters')
    .max(20, 'Maximum 20 characters')
    .required('Required'),

  surname: Yup.string()
    .trim()
    .matches(/^\S+$/, 'No spaces allowed')
    .min(3, 'Minimum 3 characters')
    .max(20, 'Maximum 20 characters')
    .required('Required'),

  email: Yup.string()
    .email('Invalid email')
    .trim()
    .matches(/^\S+$/, 'No spaces allowed')
    .required('Required'),

  password: Yup.string()
    .trim()
    .matches(/^\S+$/, 'No spaces allowed')
    .min(6, 'Minimum 6 characters')
    .max(20, 'Maximum 20 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'At least 1 uppercase, 1 lowercase, and 1 number',
    )
    .required('Required'),

  confirmPassword: Yup.string()
    .trim()
    .matches(/^\S+$/, 'No spaces allowed')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),

  country: Yup.string().required('Please select a country'),
});

export default function Register({navigation}) {
  const {colors} = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View
            style={{flex: 1, backgroundColor: colors.background, padding: 20}}>
            <Text style={{color: colors.text, fontSize: 24}}>
              Register Page
            </Text>
            <ThemeSwitch />

            <Formik
              initialValues={{
                username: '',
                name: '',
                surname: '',
                email: '',
                password: '',
                confirmPassword: '',
                country: '',
              }}
              validationSchema={RegisterSchema}
              onSubmit={values => {
                const body = {
                  username: values.username,
                  name: values.name,
                  surname: values.surname,
                  email: values.email,
                  password: values.password,
                  country: values.country,
                };
                console.log('Registering:', body);

                axios
                  .post('http://localhost:3000/api/register', body)
                  .then(response => {
                    console.log('Registration successful:', response.data);
                    navigation.navigate('VerificationLoadingScreen');
                  })
                  .catch(error => {
                    console.error('Registration error:', error);
                  });
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.loginBox}>
                  {[
                    {name: 'username', placeholder: 'Username'},
                    {name: 'name', placeholder: 'First Name'},
                    {name: 'surname', placeholder: 'Surname'},
                    {name: 'email', placeholder: 'Email'},
                  ].map(field => (
                    <View key={field.name}>
                      <TextInput
                        placeholder={field.placeholder}
                        onChangeText={handleChange(field.name)}
                        autoComplete="off" // iOS: wyłącza silne hasła
                        textContentType="none" // iOS: wyłącza sugestie
                        autoCorrect={false} // Android/iOS: wyłącza autokorektę
                        autoCapitalize="none"
                        onBlur={handleBlur(field.name)}
                        value={values[field.name]}
                        style={styles.typeBox}
                      />
                      {touched[field.name] && errors[field.name] && (
                        <Text style={{color: 'red'}}>{errors[field.name]}</Text>
                      )}
                    </View>
                  ))}

                  <TextInput
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    autoComplete="off" // iOS: wyłącza silne hasła
                    textContentType="none" // iOS: wyłącza sugestie
                    autoCorrect={false} // Android/iOS: wyłącza autokorektę
                    autoCapitalize="none"
                    value={values.password}
                    style={styles.typeBox}
                  />
                  {touched.password && errors.password && (
                    <Text style={{color: 'red'}}>{errors.password}</Text>
                  )}

                  <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry
                    onChangeText={handleChange('confirmPassword')}
                    autoComplete="off" // iOS: wyłącza silne hasła
                    textContentType="none" // iOS: wyłącza sugestie
                    autoCorrect={false} // Android/iOS: wyłącza autokorektę
                    autoCapitalize="none"
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    style={styles.typeBox}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={{color: 'red'}}>{errors.confirmPassword}</Text>
                  )}

                  <CountryPicker
                    selectedCountry={values.country}
                    onSelect={value => setFieldValue('country', value)}
                    colors={colors}
                  />
                  {touched.country && errors.country && (
                    <Text style={{color: 'red'}}>{errors.country}</Text>
                  )}

                  <View style={{marginTop: 20}}>
                    <Button
                      title="Register"
                      onPress={handleSubmit}
                      color={colors.primary}
                    />
                  </View>
                </View>
              )}
            </Formik>

            <View style={{marginTop: 20}}>
              <Button
                title="Masz już konto? Zaloguj się"
                onPress={() => navigation.navigate('Login')}
                color={colors.primary}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
