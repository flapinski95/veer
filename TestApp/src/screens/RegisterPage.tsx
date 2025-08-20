// src/screens/RegisterPage.tsx
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
  StyleSheet,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CountryPicker from '../components/CountryPicker';
import axios from 'axios';

// ----- Typy -----
type RegisterValues = {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
};

type Props = { navigation: any };

// ----- Walidacja -----
const RegisterSchema: Yup.ObjectSchema<RegisterValues> = Yup.object({
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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'At least 1 uppercase, 1 lowercase, and 1 number')
    .required('Required'),
  confirmPassword: Yup.string()
    .trim()
    .matches(/^\S+$/, 'No spaces allowed')
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
  country: Yup.string().required('Please select a country'),
});

const s = (n: number) => n * 8; // skala 8‑pt

const RegisterPage: React.FC<Props> = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();

  const handleSubmitForm = async (values: RegisterValues) => {
    try {
      const body = {
        username: values.username,
        name: values.name,
        surname: values.surname,
        email: values.email,
        password: values.password,
        country: values.country,
      };

      // Podmień na swój backend:
      const API_URL = 'http://localhost:3000';
      const res = await axios.post(`${API_URL}/api/register`, body);

      console.log('Registration successful:', res.data);
      const userId = res.data?.user?.id;
      navigation.navigate('VerificationLoadingScreen', { userId });
    } catch (error: any) {
      if (error?.response) {
        console.error('🔴 Registration error:', error.response.data);
      } else {
        console.error('❌ Unknown error:', error?.message ?? String(error));
      }
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header z przełącznikiem motywu */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Register Page</Text>
        <Pressable
          onPress={toggleTheme}
          style={[styles.iconBtn, { borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Toggle theme"
          hitSlop={10}
        >
          <Text style={{ fontSize: 18, color: colors.text }}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: s(2) }}>
            <Formik<RegisterValues>
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
              onSubmit={handleSubmitForm}
            >
              {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                <View style={styles.form}>
                  {[
                    { name: 'username', placeholder: 'Username' },
                    { name: 'name', placeholder: 'First Name' },
                    { name: 'surname', placeholder: 'Surname' },
                    { name: 'email', placeholder: 'Email' },
                  ].map((field) => (
                    <View key={field.name} style={{ marginBottom: s(1) }}>
                      <TextInput
                        placeholder={field.placeholder}
                        placeholderTextColor={colors.text + '80'}
                        onChangeText={handleChange(field.name as keyof RegisterValues)}
                        onBlur={handleBlur(field.name as keyof RegisterValues)}
                        autoComplete="off"
                        autoCorrect={false}
                        autoCapitalize="none"
                        value={(values as any)[field.name]}
                        style={[
                          styles.input,
                          { borderColor: colors.border, color: colors.text, backgroundColor: 'transparent' },
                        ]}
                      />
                      {touched[field.name as keyof RegisterValues] && (errors as any)[field.name] && (
                        <Text style={styles.error}>{(errors as any)[field.name]}</Text>
                      )}
                    </View>
                  ))}

                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={colors.text + '80'}
                    secureTextEntry
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    autoComplete="off"
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={values.password}
                    style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                  />
                  {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor={colors.text + '80'}
                    secureTextEntry
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    autoComplete="off"
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={values.confirmPassword}
                    style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.error}>{errors.confirmPassword}</Text>
                  )}

                  <View style={{ marginTop: s(1) }}>
                    <CountryPicker
                      selectedCountry={values.country}
                      onSelect={(value: string) => setFieldValue('country', value)}
                      colors={colors}
                    />
                    {touched.country && errors.country && <Text style={styles.error}>{errors.country}</Text>}
                  </View>

                  <View style={{ marginTop: s(2) }}>
                    <Button title="Register" onPress={handleSubmit as unknown as () => void} color={colors.primary} />
                  </View>

                  <View style={{ marginTop: s(2) }}>
                    <Button
                      title="Masz już konto? Zaloguj się"
                      onPress={() => navigation.navigate('Login')}
                      color={colors.primary}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterPage;

// ----- Style -----
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: s(2),
    paddingTop: s(1),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(2),
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
  },
  iconBtn: {
    borderRadius: 12,
    padding: s(1),
    borderWidth: StyleSheet.hairlineWidth,
  },
  form: {
    gap: s(1),
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: s(2),
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
  },
});