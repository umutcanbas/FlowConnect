import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { GameControlsProps } from '../../types/game';
import { COLORS } from '../../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_SMALL_SCREEN = SCREEN_WIDTH <= 375 || SCREEN_HEIGHT <= 667;

export default function GameControls({
  onUndo,
  canUndo,
  onReset,
  isLevelComplete,
  onNextLevel,
  isLastLevel
}: GameControlsProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.undoButton,
            !canUndo && styles.disabledButton
          ]} 
          onPress={onUndo}
          disabled={!canUndo}
        >
          <Text style={[
            styles.buttonText,
            !canUndo && styles.disabledButtonText
          ]}>↩️ Undo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={onReset}
        >
          <Text style={styles.buttonText}>🔄 Reset</Text>
        </TouchableOpacity>
      </View>

      {isLevelComplete && (
        <View style={styles.levelCompleteContainer}>
          <Text style={styles.levelCompleteText}>🎉 Level Complete!</Text>
          <TouchableOpacity 
            style={[styles.button, styles.nextLevelButton]} 
            onPress={onNextLevel}
            disabled={isLastLevel}
          >
            <Text style={styles.buttonText}>
              {isLastLevel ? "🏆 All Complete!" : "➡️ Next Level"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: IS_SMALL_SCREEN ? 15 : 20,
    paddingBottom: IS_SMALL_SCREEN ? 15 : 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: IS_SMALL_SCREEN ? 10 : 15,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: IS_SMALL_SCREEN ? 16 : 20,
    paddingVertical: IS_SMALL_SCREEN ? 10 : 12,
    borderRadius: 8,
    minWidth: IS_SMALL_SCREEN ? 80 : 100,
    alignItems: 'center',
  },
  undoButton: {
    backgroundColor: COLORS.BUTTON.UNDO,
  },
  resetButton: {
    backgroundColor: COLORS.BUTTON.RESET,
  },
  nextLevelButton: {
    backgroundColor: COLORS.BUTTON.NEXT_LEVEL,
  },
  disabledButton: {
    backgroundColor: COLORS.BUTTON.DISABLED,
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.BUTTON.TEXT,
    fontSize: IS_SMALL_SCREEN ? 14 : 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: COLORS.BUTTON.TEXT_DISABLED,
  },
  levelCompleteContainer: {
    marginTop: IS_SMALL_SCREEN ? 15 : 20,
    padding: IS_SMALL_SCREEN ? 12 : 15,
    backgroundColor: COLORS.BUTTON.SUCCESS_BACKGROUND,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.BUTTON.SUCCESS_BORDER,
    maxWidth: IS_SMALL_SCREEN ? 280 : 320,
  },
  levelCompleteText: {
    color: COLORS.BUTTON.SUCCESS_TEXT,
    fontSize: IS_SMALL_SCREEN ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: IS_SMALL_SCREEN ? 8 : 10,
  },
});