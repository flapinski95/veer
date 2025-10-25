// src/screens/Home.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  StatusBar,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

type CardItem = {
  id: string;
  title: string;
  subtitle: string;
};

const DATA: CardItem[] = [
  { id: '1', title: 'Morning Run', subtitle: '5.2 km • 28 min' },
  { id: '2', title: 'City Walk', subtitle: '3.1 km • 45 min' },
  { id: '3', title: 'Park Loop', subtitle: '2.0 km • 22 min' },
  { id: '4', title: 'Seaside Route', subtitle: '6.7 km • 55 min' },
  { id: '5', title: 'Old Town Tour', subtitle: '4.3 km • 38 min' },
  { id: '6', title: 'Hill Sprints', subtitle: '1.5 km • 12 min' },
];

export default function Home({ navigation }: any) {
  const { colors, toggleTheme, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const s = (n: number) => n * 8;

  const columns = width >= 390 ? 2 : 1;

  const styles = useMemo(() => createStyles(colors, s, columns), [colors, width, columns]);

  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      DATA.filter(
        (it) =>
          it.title.toLowerCase().includes(query.toLowerCase()) ||
          it.subtitle.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const renderItem = ({ item }: { item: CardItem }) => (
    <Pressable
      onPress={() => navigation.navigate('Saved')}
      style={styles.card}
      android_ripple={{ color: '#00000020' }}
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.title}`}
      hitSlop={10}
    >
      <View style={styles.cardMedia} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
        style={[styles.safe, { paddingBottom: Math.max(insets.bottom, s(2)) }]}
        edges={['top','left','right']}
    >
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Hey there 👋</Text>
          <Text style={styles.subtitle}>Plan your next route</Text>
        </View>

        <Pressable
          onPress={toggleTheme}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Toggle theme"
          hitSlop={10}
        >
          <Text style={styles.iconBtnText}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search routes…"
          placeholderTextColor={colors.text + '80'}
          style={styles.searchInput}
          returnKeyType="search"
          accessibilityLabel="Search routes"
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickRow}>
        <QuickAction
          label="New Route"
          onPress={() => navigation.navigate('Saved')}
          colors={colors}
          s={s}
        />
        <QuickAction
          label="Near Me"
          onPress={() => navigation.navigate('Saved')}
          colors={colors}
          s={s}
        />
        <QuickAction
          label="Favorites"
          onPress={() => navigation.navigate('Saved')}
          colors={colors}
          s={s}
        />
        <QuickAction label="Map" onPress={() => navigation.navigate('Map')} colors={colors} s={s}/>
      </View>

      {/* Responsive list */}
      <FlatList
        data={filtered}
        key={columns} // wymusza prze-render przy zmianie kolumn
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No results. Try a different keyword.</Text>
        }
      />
    </SafeAreaView>
  );
}

/** ----------------- Sub‑components ----------------- */

function QuickAction({
  label,
  onPress,
  colors,
  s,
}: {
  label: string;
  onPress: () => void;
  colors: any;
  s: (n: number) => number;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: s(1.5),
        paddingHorizontal: s(2),
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      android_ripple={{ color: '#00000020' }}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={10}
    >
      <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

/** ----------------- Styles ----------------- */

function createStyles(colors: any, s: (n: number) => number, columns: number) {
  const cardGap = s(1.5);
  const cardBasis = columns === 2 ? `calc((100% - ${cardGap}px) / 2)` : '100%';

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: s(2),
      paddingBottom: s(1),
    },
    greeting: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '700',
    },
    subtitle: {
      color: colors.text + 'B3',
      fontSize: 14,
      marginTop: 4,
    },
    iconBtn: {
      marginLeft: s(1),
      borderRadius: 12,
      padding: s(1),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    iconBtnText: {
      fontSize: 18,
      color: colors.text,
    },
    searchWrap: {
      paddingHorizontal: s(2),
      paddingVertical: s(1),
    },
    searchInput: {
      backgroundColor: Platform.select({ ios: '#0000000F', android: '#00000012' }),
      color: colors.text,
      borderColor: colors.border,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 12,
      paddingHorizontal: s(2),
      paddingVertical: s(1.5),
    },
    quickRow: {
      flexDirection: 'row',
      gap: s(1),
      paddingHorizontal: s(2),
      paddingBottom: s(1),
    },
    listContent: {
      paddingHorizontal: s(2),
      paddingTop: s(1),
      paddingBottom: s(2),
      gap: cardGap,
    },
    card: {
      flexBasis: cardBasis as any, // RN nie rozumie calc, ale zadziała gdy użyjemy numColumns. Alternatywnie niżej robimy width w renderze.
      flexGrow: 1,
      backgroundColor: colors.background,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    cardMedia: {
      width: '100%',
      aspectRatio: 16 / 9, // responsywne media
      backgroundColor: Platform.select({ ios: '#00000014', android: '#00000020' }),
    },
    cardBody: {
      paddingHorizontal: s(2),
      paddingVertical: s(1.5),
      gap: 4,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },
    cardSubtitle: {
      color: colors.text + 'B3',
      fontSize: 13,
    },
    emptyText: {
      color: colors.text + '99',
      fontSize: 14,
      textAlign: 'center',
      paddingVertical: s(4),
    },
  });
}