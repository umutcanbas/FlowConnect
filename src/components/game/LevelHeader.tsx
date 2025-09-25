import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LevelHeaderProps } from '../../types/game';

export default function LevelHeader({
  currentLevel,
  levelIndex,
  totalLevels
}: LevelHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flow Connect</Text>
      <Text style={styles.levelText}>
        {currentLevel.toUpperCase()} ({levelIndex + 1}/{totalLevels})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 15,
  },
});