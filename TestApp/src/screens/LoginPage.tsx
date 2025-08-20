// src/screens/LoginPage.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

type LoginValues = {
  email: string;
  password: string;
};

type Props = { navigation: any };

const LoginSchema: Yup.Schema<LoginValues> = Yup.object({
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
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
      'Must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Required'),
});

const LoginPage: React.FC<Props> = ({ navigation }) => {
  const { colors, toggleTheme, theme } = useTheme();

  const handleLogin = async (values: LoginValues) => {
    try {
      const body = { login: values.email, password: values.password };
      const res = await axios.post('http://localhost:3000/api/login', body);
      console.log('Login successful:', res.data);
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Login error:', error?.response?.data ?? error?.message ?? error);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Login Page</Text>

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

      <Formik<LoginValues>
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              placeholder="Email or Username"
              placeholderTextColor={colors.text + '80'}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              autoComplete="off"
              autoCorrect={false}
              autoCapitalize="none"
              value={values.email}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

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
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <View style={{ marginTop: 20 }}>
              <Button
                title="Login"
                onPress={handleSubmit as unknown as () => void}
                color={colors.primary}
              />
            </View>
          </View>
        )}
      </Formik>

      <View style={{ marginTop: 20 }}>
        <Button
          title="Don't have an account? Register"
          onPress={() => navigation.navigate('Register')}
          color={colors.primary}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
  },
  iconBtn: {
    borderRadius: 12,
    padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginTop: -6,
    marginBottom: 6,
  },
});