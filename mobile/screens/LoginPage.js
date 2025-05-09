import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSwitch from '../components/themeSwitch';
import styles from '../styles/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .trim('Not empty')
      .strict(true)
      .matches(/^\S+$/, 'No spaces allowed')
      .required('Required'),
  
    password: Yup.string()
      .trim('Not empty')
      .strict(true)
      .matches(/^\S+$/, 'No spaces allowed')
      .min(6, 'Minimum 6 characters')
      .max(20, 'Maximum 20 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/, 'Must contain at least one uppercase letter, one lowercase letter, and one number')
      .required('Required')
  });

export default function LoginPage({ navigation }) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <Text style={{ color: colors.text, fontSize: 24 }}>Login Page</Text>
      <ThemeSwitch />

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          console.log('Logging:', values);
          navigation.navigate('Home');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.loginBox}>
            <TextInput
              placeholder="Email or Username"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={styles.typeBox}
            />
            {touched.email && errors.email && (
              <Text style={{ color: 'red' }}>{errors.email}</Text>
            )}

            <TextInput
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              style={styles.typeBox}
            />
            {touched.password && errors.password && (
              <Text style={{ color: 'red' }}>{errors.password}</Text>
            )}

            <View style={{ marginTop: 20 }}>
              <Button title="Login" onPress={handleSubmit} color={colors.primary} />
            </View>
          </View>
        )}
      </Formik>
        <View style={{ marginTop: 20 }}>
            <Button title="Don't have an account? Register" onPress={() => navigation.navigate('Register')} color={colors.primary} />
        </View>
    </View>
  );
}