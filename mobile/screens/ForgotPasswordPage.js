import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {IP} from '@env';
import {response} from 'express';

const ResetPasswordSchema = Yup.object().shape({
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
});

export default function ForgotPasswordPage({navigation}) {
  const token = route.params?.token;

  return (
    <View>
      <Text>Reset Password</Text>
      <Formik
        initialValues={{password: ''}}
        validationSchema={ResetPasswordSchema}
        onSubmit={values => {
          try {
            const body = {password: values.password};
            axios
              .post(`${IP}/api/forgot-password/change-password/${token}`, body)
              .then(response => {
                console.log('Password changed:', response.data);
                navigation.navigate('Login');
              })
              .catch(error => {
                console.error(
                  'Password reset failed:',
                  error.response?.data || error.message,
                );
              });
          } catch (error) {
            console;
          }
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              placeholder="New password"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={{color: 'red'}}>{errors.password}</Text>
            )}
            <Button title="Submit" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </View>
  );
}
